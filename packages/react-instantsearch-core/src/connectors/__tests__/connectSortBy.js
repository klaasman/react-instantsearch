import { SearchParameters } from 'algoliasearch-helper';
import connect from '../connectSortBy';

jest.mock('../../core/createConnector', () => x => x);

let props;
let params;

describe('connectSortBy', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps.call(
        {},
        { items: [{ value: 'yep' }, { value: 'yop' }], contextValue },
        { sortBy: 'yep' }
      );
      expect(props).toEqual({
        items: [
          { value: 'yep', isRefined: true },
          { value: 'yop', isRefined: false },
        ],
        currentRefinement: 'yep',
      });

      props = connect.getProvidedProps.call(
        {},
        { items: [{ value: 'yep' }], defaultRefinement: 'yep', contextValue },
        {}
      );
      expect(props).toEqual({
        items: [{ value: 'yep', isRefined: true }],
        currentRefinement: 'yep',
      });

      const transformItems = jest.fn(() => ['items']);
      props = connect.getProvidedProps.call(
        {},
        {
          items: [{ value: 'yep' }, { value: 'yop' }],
          transformItems,
          contextValue,
        },
        { sortBy: 'yep' }
      );
      expect(transformItems.mock.calls[0][0]).toEqual([
        { value: 'yep', isRefined: true },
        { value: 'yop', isRefined: false },
      ]);
      expect(props.items).toEqual(['items']);
    });

    it("calling refine updates the widget's search state", () => {
      const nextState = connect.refine.call(
        {},
        { contextValue },
        { otherKey: 'val' },
        'yep'
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        page: 1,
        sortBy: 'yep',
      });
    });

    it('refines the index parameter', () => {
      params = connect.getSearchParameters.call(
        {},
        new SearchParameters(),
        { contextValue },
        { sortBy: 'yep' }
      );
      expect(params.index).toBe('yep');
    });

    it('registers its id in metadata', () => {
      const metadata = connect.getMetadata.call({}, { contextValue });
      expect(metadata).toEqual({ id: 'sortBy' });
    });

    it('should return the right searchState when clean up', () => {
      const searchState = connect.cleanUp.call(
        {},
        {
          contextValue,
        },
        {
          sortBy: { searchState: 'searchState' },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({ another: { searchState: 'searchState' } });
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'first' };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps.call(
        {},
        {
          items: [{ value: 'yep' }, { value: 'yop' }],
          contextValue,
          indexContextValue,
        },
        { indices: { first: { sortBy: 'yep' } } }
      );
      expect(props).toEqual({
        items: [
          { value: 'yep', isRefined: true },
          { value: 'yop', isRefined: false },
        ],
        currentRefinement: 'yep',
      });
    });

    it("calling refine updates the widget's search state", () => {
      const nextState = connect.refine.call(
        {},
        { contextValue, indexContextValue },
        { otherKey: 'val' },
        'yep'
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        indices: { first: { page: 1, sortBy: 'yep' } },
      });
    });

    it('refines the index parameter', () => {
      params = connect.getSearchParameters.call(
        {},
        new SearchParameters(),
        { contextValue, indexContextValue },
        { indices: { first: { sortBy: 'yep' } } }
      );
      expect(params.index).toBe('yep');
    });

    it('should return the right searchState when clean up', () => {
      const searchState = connect.cleanUp.call(
        {},
        { contextValue, indexContextValue },
        {
          indices: { first: { sortBy: { searchState: 'searchState' } } },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({
        indices: { first: {} },
        another: { searchState: 'searchState' },
      });
    });
  });
});
