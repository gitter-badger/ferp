import test from 'ava';
import { Effect } from './effect.js';

test('Effect wraps a promise', (t) => {
  const effect = new Effect(() => {});
  t.truthy(effect.promise instanceof Promise);
});

test.cb('Effect forwards #then', (t) => {
  t.plan(1);

  const effect = new Effect((done) => { done(1); });

  effect.then(value => value).then((value) => {
    t.is(value, 1);
    t.end();
  });
});

test.cb('Effect.map returns a method that resolves multiple effects', (t) => {
  t.plan(3);

  const resolver = Effect.map([Effect.immediate(true)]);

  t.truthy(resolver instanceof Promise);

  resolver
    .then((resolved) => {
      t.truthy(Array.isArray(resolved));
      t.truthy(resolved[0] instanceof Effect);
      t.end();
    });
});

test('Effect.defer allows the effect to resolve externally', (t) => {
  t.plan(3);
  const result = Effect.defer();
  t.deepEqual(Object.keys(result), ['dispatch', 'effect']);
  t.is(typeof result.dispatch, 'function');
  t.truthy(result.effect instanceof Effect);
});

test('Effect.none maps an empty array', async (t) => {
  t.deepEqual(await Effect.none(), []);
});
