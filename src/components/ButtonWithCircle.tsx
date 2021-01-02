import classNames from 'classnames';
import { FC } from 'react';
import { pixelsInRem } from '../common';

import css from './ButtonWithCircle.module.css';
import { PartialCircle } from './PartialCircle';

type Props = {
  isFreezed: boolean;
  freezePercent?: number;
  dangerouslySetInnerHTML: { __html: string; };
  onClick?(): void;
}

export const ButtonWithCircle: FC<Props> = ({
  isFreezed, freezePercent, dangerouslySetInnerHTML, onClick
}) => {
  return (
    <button
      className={css.root}
      onClick={onClick}
    >
      {isFreezed && (
        <>
          <div className={css.circle}>
            <PartialCircle
              part={freezePercent ?? 0}
              size={6 * pixelsInRem}
              strokeWidth={4}
            />
          </div>
          <div className={classNames(css.circle, css.circle_back)}>
            <PartialCircle
              part={1}
              size={6 * pixelsInRem}
              strokeWidth={4}
            />
          </div>
        </>
      )}
      <div
        className={classNames(css.button, isFreezed && css.button_freezed)}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    </button>
  );
};
