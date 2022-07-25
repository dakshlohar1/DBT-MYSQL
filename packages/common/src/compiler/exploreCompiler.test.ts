import { CompileError } from '../types/errors';
import { friendlyName } from '../types/field';
import { compileExplore } from './exploreCompiler';
import {
    exploreCircularReference,
    exploreComplexReference,
    exploreComplexReferenceCompiled,
    exploreMissingBaseTable,
    exploreMissingJoinTable,
    exploreOneEmptyTable,
    exploreOneEmptyTableCompiled,
    exploreReferenceDimension,
    exploreReferenceDimensionCompiled,
    exploreReferenceInJoin,
    exploreReferenceInJoinCompiled,
    exploreTableSelfReference,
    exploreTableSelfReferenceCompiled,
    exploreWithMetricNumber,
    exploreWithMetricNumberCompiled,
} from './exploreCompiler.mock';

test('Should compile empty table', () => {
    expect(compileExplore(exploreOneEmptyTable)).toStrictEqual(
        exploreOneEmptyTableCompiled,
    );
});

test('Should throw error when missing base table', () => {
    expect(() => compileExplore(exploreMissingBaseTable)).toThrowError(
        CompileError,
    );
});

test('Should throw error when missing joined table', () => {
    expect(() => compileExplore(exploreMissingJoinTable)).toThrowError(
        CompileError,
    );
});

test('Should throw error when dimension has circular reference', () => {
    expect(() => compileExplore(exploreCircularReference)).toThrowError(
        CompileError,
    );
});

test('Should compile table with TABLE reference', () => {
    expect(compileExplore(exploreTableSelfReference)).toStrictEqual(
        exploreTableSelfReferenceCompiled,
    );
});

test('Should compile table with reference to another dimension', () => {
    expect(compileExplore(exploreReferenceDimension)).toStrictEqual(
        exploreReferenceDimensionCompiled,
    );
});

test('Should compile table with nested references in dimensions and metrics', () => {
    expect(compileExplore(exploreComplexReference)).toStrictEqual(
        exploreComplexReferenceCompiled,
    );
});

test('Should compile with a reference to a dimension in a joined table', () => {
    expect(compileExplore(exploreReferenceInJoin)).toStrictEqual(
        exploreReferenceInJoinCompiled,
    );
});

test('Should compile with a reference to a metric in a non-aggregate metric', () => {
    expect(compileExplore(exploreWithMetricNumber)).toStrictEqual(
        exploreWithMetricNumberCompiled,
    );
});

describe('Default field labels render for', () => {
    test('uppercase field names', () => {
        expect(friendlyName('MYFIELDID')).toEqual('Myfieldid');
        expect(friendlyName('MY_FIELD_ID')).toEqual('My field id');
    });
    test('camel case names', () => {
        expect(friendlyName('myFieldId')).toEqual('My field id');
    });
    test('snake case names', () => {
        expect(friendlyName('my_field_id')).toEqual('My field id');
    });
    test('names with numbers at the start', () => {
        expect(friendlyName('1_field_id')).toEqual('1 field id');
    });
    test('names with numbers in the middle', () => {
        expect(friendlyName('my_1field_id')).toEqual('My 1field id');
    });
});
