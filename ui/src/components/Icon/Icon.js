import React from 'react';
import classNames from 'classnames';

import './Icon.scss';

const Icon = ({icon, className, ...props}) => {
    const iconClass = `icon-${icon.toLowerCase()}`;

    return (
        <i className={classNames('TnIcon', iconClass, className)} {...props}/>
    )
};

export default Icon;
