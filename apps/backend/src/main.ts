import { scope, type } from 'arktype';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Path } from 'arktype/internal/utils/paths.js';

/**
 * Schema:
 * check an array of pairs of angles and heights
 * angle - is a number between 0 and 90, except the last pair in the array, where it can go to -90
 * height - is a number between 0 and 100
 *
 * if angle is defined, height must be defined too
 * if height is defined, angle must be defined too
 *
 */

const angle = type('-90<number<90|null');
const height = type('0<number<100 | null');

const ahSchema = scope({
  ahPair: [
    {
      angle,
      height,
    },
    '=>',
    ({ angle, height }, problems) => {
      if (angle && height === null) {
        problems.mustBe('defined if angle is defined', {
          path: new Path('height'),
        });
        return false;
      }

      if (angle === null && height) {
        problems.mustBe('defined if height is defined', {
          path: new Path('angle'),
        });

        console.log('angle null', new Path('angle'));

        return false;
      }

      return true;
    },
  ],

  ahPairs: [
    'ahPair[]',
    '=>',
    (ahPairs, problems) => {
      let problemsExist = false;
      ahPairs.forEach((ah, index) => {
        if (ahPairs.length - 1 !== index && ah.angle && ah.angle < 0) {
          problems.mustBe('larger than 0', {
            path: new Path([`${index}`, 'angle']),
          });
          problemsExist = true;
        }
      });
      return problemsExist;
    },
  ],
}).compile();

export const x = ahSchema.ahPair({ angle: 22, height: null });

console.log(x.problems);
