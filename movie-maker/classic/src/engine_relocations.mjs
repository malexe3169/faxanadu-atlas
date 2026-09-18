// Relocations for a shared engine whose tail moves. Offsets into the generated
// core and tail that hold an address pointing into the tail or the bundle at
// its end, so both can sit above a ROM's own bank 12 data. Derived by
// tools/fax_movie_relocations.py by linking the tail at 10 bases and seeing
// which bytes follow it; AtlasMovieRuntime.s SHA-256 cc27d9655187db8010507a55ccbb5c80b3ac56f9ffdc440123992f978f3becf1.

export const SHARED_CORE_WORD_RELOCATIONS = Object.freeze([18, 229, 232, 301, 328, 336, 342, 352, 360, 366, 369]);
export const SHARED_CORE_SPLIT_RELOCATIONS = Object.freeze([[26, 30]]);
export const SHARED_TAIL_WORD_RELOCATIONS = Object.freeze([87, 204, 264, 287, 463, 491, 519, 555, 634, 649, 969, 1018]);
export const SHARED_TAIL_SPLIT_RELOCATIONS = Object.freeze([]);
