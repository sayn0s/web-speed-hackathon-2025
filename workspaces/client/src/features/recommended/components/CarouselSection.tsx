import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useMemo } from 'react';
import { ArrayValues } from 'type-fest';
import { useMergeRefs } from 'use-callback-ref';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';
import { useCarouselItemWidth } from '@wsh-2025/client/src/features/recommended/hooks/useCarouselItemWidth';
import { useScrollSnap } from '@wsh-2025/client/src/features/recommended/hooks/useScrollSnap';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ module }: Props) => {
  const containerRefForScrollSnap = useScrollSnap({ scrollPadding: 24 });
  const { ref: containerRefForItemWidth, width: itemWidth } = useCarouselItemWidth();
  const mergedRef = useMergeRefs([containerRefForItemWidth, containerRefForScrollSnap]);

  // アイテムスタイルをメモ化してレンダリングを最適化
  const itemStyle = useMemo(
    () => ({
      width: `${itemWidth}px`,
      flexShrink: 0,
      flexGrow: 0,
    }),
    [itemWidth],
  );

  // moduleのアイテムをメモ化
  const renderedItems = useMemo(() => {
    return module.items.map((item) => (
      <div key={item.id} style={itemStyle}>
        {item.series != null ? <SeriesItem series={item.series} /> : null}
        {item.episode != null ? <EpisodeItem episode={item.episode} /> : null}
      </div>
    ));
  }, [module.items, itemStyle]);

  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
        <div
          key={module.id}
          ref={mergedRef}
          className="relative mx-[-24px] flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[24px] pr-[56px]"
          data-scroll-restore={`carousel-${module.id}`}
        >
          {renderedItems}
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};
