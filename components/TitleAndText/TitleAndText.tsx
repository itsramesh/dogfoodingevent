/*
 * Copyright 2021 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import styles from './TitleAndText.module.scss';

interface TitleAndTextCompound {
  title?: string;
  text?: {
    value?: string;
  };
}

export function TitleAndText({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  let title;
  let text;

  const content = getContainerItemContent<TitleAndTextCompound>(component, page);
  if (content !== null) {
    title = content.title;
    text = content.text;
  }

  const { titlesize = 'H3', textalignment = 'center', style = 'style1' } = component.getParameters();
  const sectionStyle = styles[style];

  // eslint-disable-next-line dot-notation
  const freeshippingstyle = styles['freeshipping'];
  // eslint-disable-next-line dot-notation
  const bannerTitle = styles['banner-title'];
  // eslint-disable-next-line dot-notation
  const bannerTitleBG = styles['banner-title-bg'];
  // eslint-disable-next-line dot-notation
  const bannetTitleText = styles['banner-title-text'];
  // eslint-disable-next-line dot-notation
  const bannetTitleHeading = styles['banner-title-heading'];

  return (
    <>

      {title !== 'Free shipping' && title !== 'Painting a wall in three easy steps' && <>
        <section className={`${sectionStyle} pb-1 text-${textalignment}`}>
          {titlesize === 'H1' && <h1 className="mb-2">{title}</h1>}
          {titlesize === 'H2' && <h2 className="mb-2">{title}</h2>}
          {titlesize === 'H3' && <h3 className="mb-2">{title}</h3>}
          {titlesize === 'H4' && <h4 className="mb-2">{title}</h4>}
          {titlesize === 'H5' && <h5 className="mb-2">{title}</h5>}
          {text && <div>{text}</div>}
        </section>
      </>}
      {title === 'Free shipping' && <>
        <div className={freeshippingstyle}>{title}</div>
      </>}
      {title === 'Painting a wall in three easy steps' && <>
        <div className={bannerTitle}>
          <div className={bannerTitleBG}>
            <div className={bannetTitleHeading}>
              Tutorial
            </div>
            <div className={bannetTitleText}>
              {title}
            </div>
            <div>
              {text}
            </div>
            <div>
              <span></span>
            </div>
            <div></div>
          </div>
        </div>
      </>}
    </>
  );
}
