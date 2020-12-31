import classNames from 'classnames';
import { FC } from 'react';

import css from './ButtonWithCircle.module.css';

type Props = {
  isFreezed: boolean;
  dangerouslySetInnerHTML: { __html: string; };
  onClick?(): void;
}

export const ButtonWithCircle: FC<Props> = ({ isFreezed, dangerouslySetInnerHTML, onClick }) => {
  return (
    <button
        className={classNames(
          css.root,
          isFreezed && css.root_freezed
        )}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        onClick={onClick}
      />
  );
};
