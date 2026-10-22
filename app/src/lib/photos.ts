import * as MediaLibrary from 'expo-media-library/legacy';

// The library API doesn't expose file sizes cheaply, so storage freed is an estimate.
export const AVERAGE_PHOTO_MB = 3;

export type Month = {
  key: string;
  label: string;
  start: number;
  end: number;
  count: number;
};

const MONTHS_TO_SCAN = 36;

function monthLabel(date: Date) {
  const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export async function getMonthsWithPhotos(): Promise<Month[]> {
  const now = new Date();
  const ranges = Array.from({ length: MONTHS_TO_SCAN }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    return { start, end };
  });

  const months = await Promise.all(
    ranges.map(async ({ start, end }) => {
      const page = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: MediaLibrary.MediaType.photo,
        createdAfter: start.getTime(),
        createdBefore: end.getTime(),
      });
      return {
        key: `${start.getFullYear()}-${start.getMonth() + 1}`,
        label: monthLabel(start),
        start: start.getTime(),
        end: end.getTime(),
        count: page.totalCount,
      };
    })
  );

  return months.filter((m) => m.count > 0);
}

export async function getPhotosInRange(start: number, end: number) {
  const assets: MediaLibrary.Asset[] = [];
  let after: string | undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await MediaLibrary.getAssetsAsync({
      first: 200,
      after,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [[MediaLibrary.SortBy.creationTime, true]],
      createdAfter: start,
      createdBefore: end,
    });
    assets.push(...page.assets);
    after = page.endCursor;
    hasNextPage = page.hasNextPage;
  }

  return assets;
}

export async function deletePhotos(ids: string[]) {
  // iOS shows its own confirmation dialog and moves photos to "Recently Deleted".
  return MediaLibrary.deleteAssetsAsync(ids);
}

export function formatStorage(photoCount: number) {
  const mb = photoCount * AVERAGE_PHOTO_MB;
  if (mb >= 1000) return `${(mb / 1000).toFixed(1).replace('.', ',')} Go`;
  return `${mb} Mo`;
}
