/*
 * Copyright 2020 Bloomreach
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

import React, { useContext, useEffect, useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemIdModel, ProductDetailInputProps, useProductDetail } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../CommerceContext';
import styles from './ProductHighlight.module.scss';
import { isLoading } from '../../src/utils';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  connectorId?: string;
  totalItem?: number
  itemId: ItemIdModel;
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}
/* eslint-disable max-len */
export function ProductHighlightItem({ connectorId, itemId, totalItem, setError }: ProductHighlightItemProps): JSX.Element {
  const page = React.useContext(BrPageContext);

  const {
    discoveryAccountId,
    discoveryAuthKey,
    discoveryConnector,
    discoveryCustomAttrFields,
    discoveryCustomVarAttrFields,
    discoveryCustomVarListPriceField,
    discoveryCustomVarPurchasePriceField,
    discoveryDomainKey,
    discoveryViewId,
    brEnvType,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const params: ProductDetailInputProps = useMemo(
    () => ({
      itemId,
      brUid2: cookies._br_uid_2,
      connector: connectorId ?? discoveryConnector,
      customAttrFields: discoveryCustomAttrFields,
      customVariantAttrFields: discoveryCustomVarAttrFields,
      customVariantListPriceField: discoveryCustomVarListPriceField,
      customVariantPurchasePriceField: discoveryCustomVarPurchasePriceField,
      discoveryAccountId,
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryViewId,
      brEnvType,
    }),
    [
      itemId,
      cookies._br_uid_2,
      discoveryCustomAttrFields,
      discoveryAccountId,
      discoveryAuthKey,
      discoveryConnector,
      discoveryCustomVarAttrFields,
      discoveryCustomVarListPriceField,
      discoveryCustomVarPurchasePriceField,
      discoveryDomainKey,
      discoveryViewId,
      connectorId,
      brEnvType,
    ],
  );
  const [item, loading, error] = useProductDetail(params);
  useEffect(() => {
    if (error) {
      setError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  const selectedItemId = params.itemId as ItemIdModel;
  const selectedVariant = item?.variants?.find(
    (variant) => variant?.itemId.id === selectedItemId.id && variant?.itemId.code === selectedItemId.code,
  );
  const { listPrice, purchasePrice, displayName, imageSet } = selectedVariant ?? item ?? {};
  const price = useMemo(() => listPrice?.moneyAmounts?.[0], [listPrice]);
  const sale = useMemo(() => purchasePrice?.moneyAmounts?.[0], [purchasePrice]);
  const displayPrice = sale ?? price;
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

  if (!item || isLoading(loading)) {
    return <div />;
  }

  return (
    <>
      {
        totalItem && totalItem > 1 && <Link
          href={page?.getUrl(`/products/${item?.itemId.code ?? item?.itemId.id}`)}
          className="col-sm-3 mb4 text-reset text-decoration-none"
        >
          {thumbnail && (
            <div className={`${styles['img-container']}`}>
              <Image src={thumbnail} alt={displayName ?? ''} />
            </div>
          )}
          <div className={`${styles.name} d-block h4 text-truncate mb-3`}>
            {item?.displayName}
          </div>
          <h4 className="mb-4">
            {displayPrice && (
              <div className={`${styles.price}`}>
                {displayPrice.currency ?? '$'} {displayPrice.amount}
              </div>
            )}
          </h4>
        </Link>
      }
      {
        totalItem && totalItem === 1 && <Link
          href={page?.getUrl(`/products/${item?.itemId.code ?? item?.itemId.id}`)}
          className="text-reset text-decoration-none"
        >
          {thumbnail && (
            <div className={`${styles['img-container']}`}>
              <Image src={thumbnail} alt={displayName ?? ''} />
            </div>
          )}
          <div className={`${styles.name} d-block h4 text-truncate mb-3 w-50`}>
            {item?.displayName}
          </div>
          <h4 className="mb-4">
            {displayPrice && (
              <div className={`${styles.price}`}>
                {displayPrice.currency ?? '$'} {displayPrice.amount}
              </div>
            )}
          </h4>
        </Link>
      }

    </>
  );
}
