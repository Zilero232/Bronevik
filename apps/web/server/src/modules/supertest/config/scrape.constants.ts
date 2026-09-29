export const SUPERTEST_SOURCES = {
  official: 'tanki.su'
} as const;

export const SUPERTEST_SCRAPE = {
  titlePattern: /супер\s?тест/iu,
  titleNeedles: ['супертест', 'супер тест'],
  lookbackDays: 180,
  maxPages: 8,
  minTankNameLength: 3
} as const;

export const SUPERTEST_ARTICLE = {
  maxHeadingLength: 48,
  maxHeadingWords: 6,
  maxChangeLineLength: 220,
  bullet: /^[\s•·●▪►*\-–—]+/u,
  sectionHeading:
    /^(характеристик|изменени|огнев|подвижност|живучест|бронирован|маскировк|орудие|башн|корпус|ходов|двигател|список|новые|танки|машины|примечани|важно|было|стало|параметр|обзор$)/iu,
  newVehicleMarker: /нов(?:ая|ый|ые|ой)\s+(?:машин|танк|ветк|техник)|(?:выходит|отправля\p{L}*|появ\p{L}*)\s+на\s+супер\s?тест/iu
} as const;
