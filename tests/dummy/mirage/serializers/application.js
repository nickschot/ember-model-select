import { JSONAPISerializer } from 'miragejs';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import { dasherize } from '@ember/string';
import { pluralize } from 'ember-inflector';

/**
 * findNestedRelationship
 *
 * @param {<object>}	record - main resource object
 * @param {<array>}	relationships - array of all included relationships
 * @param {<string>}	path - the string path for the nested relationship
 *
 * @return {<object>}
 */
function findNestedRelationship(record, relationships, path) {
  let pathSegments = path.split('.'),
    // property = pathSegments.pop(),
    firstRelationship = pathSegments.shift(),
    // first relationship will be in the data object
    firstRelationshipId = parseInt(
      get(record, `relationships.${firstRelationship}.data.id`)
    );

  // access first relationships object from the includes array
  firstRelationship = relationships.find((relationship) => {
    return (
      parseInt(relationship.id) === firstRelationshipId &&
      relationship.type === pluralize(firstRelationship)
    );
  });

  if (!firstRelationship) {
    return null;
  }

  if (pathSegments.length === 1) {
    return firstRelationship;
  }

  let currentRelationship = firstRelationship,
    lastRelationship;

  while (pathSegments.length > 0) {
    let nextRelationshipModel = pathSegments.shift(),
      nestedPath = `relationships.${nextRelationshipModel}.data.id`,
      nextRelationshipId = get(currentRelationship, nestedPath);

    if (!nextRelationshipId) {
      break;
    }

    currentRelationship = relationships.find((relationship) => {
      return (
        parseInt(relationship.id) === nextRelationshipId &&
        relationship.type === pluralize(nextRelationshipModel)
      );
    });

    lastRelationship = currentRelationship;
  }

  if (lastRelationship) {
    return lastRelationship;
  } else {
    return null;
  }
}

export default JSONAPISerializer.extend({
  searchByFields: A(['name']),
  searchKey: 'search',
  sortKey: 'sort',
  filterKey: 'filter',
  ignoreFilters: A([]),
  filterHook: null,

  serialize(object, request) {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);

    // Add metadata, sort parts of the response, etc.

    // Is this a list response
    if (Array.isArray(json.data)) {
      return this._serialize(json, request);
    }

    //
    return json;
  },

  _serialize(json, request) {
    let filters = this._extractFilterParams(request.queryParams);
    // Filter data
    json.data = this.filterResponse(json, filters);
    // Sort data
    json.data = this.sortResponse(json, get(request.queryParams, this.sortKey));
    // Any Hooks?
    const hook = this.filterHook;

    if (hook) {
      json = hook(json, request);
    }
    // Paginate?
    json = this.paginate(json, request);

    return json;
  },

  /**
    Filter responses by filter params

    _NOTE! to filter by a relationship id it must be included
    in the requests "include" param. Otherwise this serializer
    does not include data from that relationship in it's 'data'_

    @access protected
    @method filterResponse
    @param {Array} data
    @param {Array} filters
    @return {Array}
   */
  filterResponse(json, filters) {
    let data = json.data;

    if (filters.length) {
      filters.forEach((filter) => {
        if (this.ignoreFilters.indexOf(filter.property) !== -1) {
          return;
        }

        const attributePath = `attributes.${dasherize(filter.property)}`;

        data = data.filter((record) => {
          let match = false;

          filter.property = dasherize(filter.property);

          filter.values.forEach((value) => {
            // Check for an attribute match
            // Is this a search term?
            if (filter.property === this.searchKey && value) {
              if (this.filterBySearch(record, value)) {
                match = true;
              }
            }
            // Is this an attribute filter?
            else if (this._isAttributeKey(filter.property, record)) {
              let attribute = get(record, attributePath);

              // Convert bool to string
              if (typeof attribute === 'boolean') {
                attribute = attribute.toString();
              }

              // Convert number to string
              if (typeof attribute === 'number') {
                attribute = attribute.toString();
              }

              if (value === attribute) {
                match = true;
              }
            }
            // Is this a related belongs to id?
            else if (filter.property.endsWith('-id')) {
              let relationship = filter.property.replace('-id', ''),
                path = `relationships.${relationship}.data.id`;

              // check the related model is present in the response
              if (this._hasIncludedRelationship(relationship, json.included)) {
                // Check for a relationship match
                if (parseInt(value) === parseInt(get(record, path))) {
                  match = true;
                }
              }
            }
            // Is this a related hasMany to id(s)?
            else if (filter.property.endsWith('-ids')) {
              // Has Many Relationship
              let relationship = filter.property.replace('-ids', ''),
                path = `relationships.${pluralize(relationship)}.data`;

              // check the related model is present in the response
              if (this._hasIncludedRelationship(relationship, json.included)) {
                // Loop though relationships for a match
                get(record, path).forEach((related) => {
                  if (parseInt(value) === parseInt(related.id)) {
                    match = true;
                  }
                });
              }
            }
            // Is this a related attribute?
            else if (filter.property.includes('.')) {
              let segments = filter.property.split('.'),
                // last item will be the property
                relationshipProperty = segments[segments.length - 1];
              // check this path exists in the includes property of our response data

              if (relationshipProperty !== 'id') {
                relationshipProperty = `attributes.${relationshipProperty}`;
              }

              // find the nested relationship from the included array
              let relationship = findNestedRelationship(
                record,
                json.included,
                filter.property
              );

              if (relationship) {
                if (get(relationship, relationshipProperty) == value) {
                  match = true;
                }
              }
            } else {
              match = true;
            }
          });

          return match;
        });
      });
    }
    return data;
  },

  /**
    Check if the model passes search filter

    @access protected
    @method filterBySearch
    @param {object}    record Serialised model instance to search
    @param {string}    term The search term
    @return {boolean}
   */
  filterBySearch(record, term) {
    const searchFields = this.searchByFields;

    if (isEmpty(searchFields)) {
      // no search fields - return record
      return true;
    }

    let matched = false;

    searchFields.forEach((field) => {
      const fieldValue = get(record, `attributes.${dasherize(field)}`);

      if (
        !isEmpty(fieldValue) &&
        fieldValue.toLowerCase().search(term.toLowerCase()) !== -1
      ) {
        matched = true;
      }
    });

    return matched;
  },

  /**
    Order responses by sort param

    _Supports one sort param atm..._
    http://jsonapi.org/format/#fetching-sorting

    @access protected
    @method sortResponse
    @param {Array} data
    @param {Array} filters
    @return {Array}
   */
  sortResponse(json, sort) {
    let desc = false,
      data = json.data;

    if (sort && data.length > 0) {
      // does this sort param start with "-"
      if (sort.indexOf('-') === 0) {
        // sort decending
        desc = true;
        // remove prefixed '-'
        sort = sort.substring(1);
      }

      // find the sort path
      if (this._isAttribute(sort)) {
        let path = this._getAttributePath(sort, data[0]);

        // sort by property
        data = A(data).sortBy(path);
      } else if (this._isRelatedAttribute(sort)) {
        // sort by related
        data = this._sortByIncludedProperty(data, json.included, sort);
      }

      // reverse sort order?
      if (desc) {
        data = A(data).reverseObjects();
      }
    }
    return data;
  },

  /**
    Paginate response

    @access protected
    @method paginate
    @param {object} results data to be paginated
    @param {object} request request object
    @return {object}
   */
  paginate(res, request) {
    if (
      request.queryParams['page[number]'] &&
      request.queryParams['page[size]']
    ) {
      const page = parseInt(request.queryParams['page[number]']),
        size = parseInt(request.queryParams['page[size]']),
        total = res ? res.data.length : 0,
        pages = Math.ceil(total / size);

      res.data = this._sliceResults(res.data, page, size);
      res.meta = this._buildMetadata(page, size, total, pages);

      return res;
    } else {
      return res;
    }
  },

  // -------
  // PRIVATE
  // -------

  _sliceResults(results, page, size) {
    const start = (page - 1) * size;
    const end = start + size;

    return results.slice(start, end);
  },

  _buildMetadata(page, size, total, pages) {
    return {
      page,
      size,
      total,
      pages,
    };
  },

  /**
    Extract filter parameters from the request

    @access private
    @param {Object} params
    @return {Array}
   */
  _extractFilterParams(params) {
    let filters = A([]);
    for (var key in params) {
      // loop though params and match any that follow the
      // filter[foo] pattern. Then extract foo.
      if (key.substr(0, 6) === this.filterKey) {
        let property = key.substr(7, key.length - 8),
          value = params[key],
          values = null;

        if (value) {
          // make sure it's a string before we split it
          values = (value + '').split(',');
        }
        if (!isEmpty(values)) {
          filters.pushObject({
            property,
            values,
          });
        }
      }
    }
    return filters;
  },

  /**
    Sort models by a related property

    @access private
    @param {Array} data       Array of serialized models to sort
    @param {Array} included   Collection of included serialized models
    @param {string} sort      Sort property
    @return {Array}
   */
  _sortByIncludedProperty(data, included, sort) {
    let idPath = this._getRelatedIdPath(sort, data[0]),
      model = this._getRelatedModel(sort),
      attrPath = this._getRelatedAttributePath(sort, data[0]);

    return data.sort((a, b) => {
      const aId = get(a, idPath),
        bId = get(b, idPath),
        aRelated = this._findIncludedModelById(included, model, aId),
        bRelated = this._findIncludedModelById(included, model, bId);

      // Bale if we didnt find a related model
      if (!aRelated || !bRelated) {
        return 0;
      }

      let aVal = get(aRelated, attrPath),
        bVal = get(bRelated, attrPath);

      // are they numbers?
      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal > bVal) {
        return 1;
      } else if (aVal < bVal) {
        return -1;
      } else {
        return 0;
      }
    });
    // return data;
  },

  _isAttribute(path) {
    return path.split('.').length === 1;
  },

  _isAttributeKey(attribute, record) {
    return Object.keys(record.attributes).includes(attribute);
  },

  _hasIncludedRelationship(model, included) {
    return A(included).filterBy('type', pluralize(model)).length > 0;
  },

  _isRelatedAttribute(path) {
    return path.split('.').length === 2;
  },

  _getRelatedIdPath(property) {
    // ensure param is underscored
    property = dasherize(property);
    // destructure property
    const relatedModel = property.split('.')[0];
    // define full path
    const path = `relationships.${relatedModel}.data.id`;

    return path;
  },

  _getAttributePath(property) {
    // ensure param is underscored
    property = dasherize(property);
    // define full path
    const path = `attributes.${property}`;
    return path;
  },

  _getRelatedModel(property) {
    // ensure param is underscored
    property = dasherize(property);
    // destructure property
    property = property.split('.')[0];
    return property;
  },

  _getRelatedAttributePath(property) {
    // ensure param is underscored
    property = dasherize(property);
    // destructure property
    property = property.split('.')[1];
    // define full path
    const path = `attributes.${property}`;

    return path;
  },

  _findIncludedModelById(array, model, id) {
    return array.find(function (item) {
      return item.type === pluralize(model) && item.id === id;
    });
  },

  _findRecordPath(property) {
    let path;
    // ensure param is underscored
    property = dasherize(property);
    // destructure property
    const [a, b] = property.split('.');
    // work out if this is a related property or not
    // and return the key
    if (!isEmpty(b)) {
      path = `relationships.${a}.data.${b}`;
    } else {
      path = `attributes.${a}`;
    }
    // warn user else
    return path;
  },
});
