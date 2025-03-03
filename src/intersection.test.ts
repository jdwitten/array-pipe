import assert from "node:assert";
import { describe, it } from "node:test";
import { intersection } from "./intersection";

describe("intersection()", () => {
  it("returns intersection of all input functions for numbers", async () => {
    const operation = intersection(
      () => [1, 3, 5, 7, 9],
      () => [2, 4, 6, 7, 9],
      () => [0, 7]
    );
    assert.deepEqual(await operation([]), [7]);
  });

  it("returns intersection of all input functions for objects with ids", async () => {
    const operation = intersection(
      () => [{ id: "bar", foo: "bar" }, { id: "foo" }, { id: "baz" }],
      () => [{ id: "foo" }, { id: "baz" }, { id: "qux" }],
      () => [{ id: "foo" }, { id: "baz" }, { id: "quux" }]
    );
    assert.deepEqual(await operation([]), [{ id: "foo" }, { id: "baz" }]);
  });

  it("allows mixing of objects and primitives", async () => {
    const operation = intersection(
      () => [1, { id: "foo" }, "foo", null, undefined],
      () => [{ id: "foo" }, 1, null],
      () => [{ id: "foo" }, { id: "baz" }, null, 1]
    );
    assert.deepEqual(await operation([]), [{ id: "foo" }, 1, null]);
  });

  it(`returns an empty array if there is no intersection`, async () => {
    const operation = intersection(
      () => [1, 3, 5, 7, 9],
      () => [2, 4, 6],
      () => [0]
    );
    assert.deepEqual(await operation([]), []);
  });

  it("returns an empty array if no functions are provided", async () => {
    const operation = intersection();
    assert.deepEqual(await operation([]), []);
  });

  it("returns an empty array if no results are found", async () => {
    const operation = intersection(
      () => [],
      () => [],
      () => []
    );
    assert.deepEqual(await operation([]), []);
  });

  it("produces a compile error if the input types are not the same", async () => {
    intersection(
      (arr: string[]) => [1, 2, 3],
        // @ts-expect-error
      (arr: number[]) => [1, 2, 3]
    );
  });

  it("produces a compile error if the output types are not the same", async () => {
    intersection(
      (arr: string[]) => [1, 2, 3],
        // @ts-expect-error
      (arr: string[]) => ["foo", "bar", "baz"]
    );
  });

  it("produces a compile error if all output object types do not have an id", async () => {
    intersection(
      () => [{ foo: "bar", id: "foo" }],
      // @ts-expect-error
      () => [{ foo: "bar" }],
    );
  });

  it("produces a compile error if all input object types do not have an id", async () => {
    intersection(
      (arr: { id: string; foo: string }[]) => [{ foo: "bar", id: "foo" }],
      // @ts-expect-error
      (arr: { foo: string }[]) => [{ foo: "bar" }],
    );
  });
});
