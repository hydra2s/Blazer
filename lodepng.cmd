emcc lodepng.cpp  -msimd128 -Oz -O3 -s LINKABLE=1 -s EXPORT_ALL=1 -sMODULARIZE -sEXPORTED_RUNTIME_METHODS="ccall,cwrap" -s ALLOW_MEMORY_GROWTH=1 -s EXPORT_ES6=1 -s TOTAL_MEMORY=1024MB -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_calloc']"