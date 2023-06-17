(module
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $none_=>_none (func))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_=>_none (func (param i32)))
 (import "env" "getPixelPack" (func $assembly/env/getPixelPack (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (memory $0 256)
 (data (i32.const 1036) "<")
 (data (i32.const 1048) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data (i32.const 1100) "<")
 (data (i32.const 1112) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00c\00m\00s\00.\00t\00s")
 (data (i32.const 1164) "<")
 (data (i32.const 1176) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data (i32.const 1260) "<")
 (data (i32.const 1272) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data (i32.const 1324) ",")
 (data (i32.const 1336) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 1372) ",")
 (data (i32.const 1384) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (export "makeARGB" (func $assembly/index/makeARGB))
 (export "makeBGRA" (func $assembly/index/makeBGRA))
 (export "makeRGBA" (func $assembly/index/makeRGBA))
 (export "premakeA" (func $assembly/index/premakeA))
 (export "makePNGData" (func $assembly/index/makePNGData))
 (export "makePNGData_RGBX32" (func $assembly/index/makePNGData_RGBX32))
 (export "alloc" (func $assembly/index/alloc))
 (export "free" (func $assembly/index/free))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load $0
  i32.const -4
  i32.and
  local.tee $3
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $3
   local.get $3
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $3
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $2
   local.get $3
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.set $4
  local.get $1
  i32.load $0 offset=8
  local.set $3
  local.get $1
  i32.load $0 offset=4
  local.tee $5
  if
   local.get $5
   local.get $3
   i32.store $0 offset=8
  end
  local.get $3
  if
   local.get $3
   local.get $5
   i32.store $0 offset=4
  end
  local.get $1
  local.get $0
  local.get $2
  i32.const 4
  i32.shl
  local.get $4
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  i32.eq
  if
   local.get $0
   local.get $2
   i32.const 4
   i32.shl
   local.get $4
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.store $0 offset=96
   local.get $3
   i32.eqz
   if
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load $0 offset=4
    i32.const -2
    local.get $4
    i32.rotl
    i32.and
    local.set $3
    local.get $1
    local.get $3
    i32.store $0 offset=4
    local.get $3
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load $0
     i32.const -2
     local.get $2
     i32.rotl
     i32.and
     i32.store $0
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load $0
  local.tee $3
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load $0
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load $0
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load $0
   local.tee $1
   i32.load $0
   local.set $6
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store $0
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store $0
  local.get $0
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  local.get $5
  i32.const 4
  i32.shl
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  local.get $3
  i32.store $0 offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store $0 offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store $0 offset=96
  local.get $0
  local.get $0
  i32.load $0
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store $0
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load $0 offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store $0 offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $2
  i32.const -16
  i32.and
  local.get $0
  i32.load $0 offset=1568
  local.tee $2
  i32.const 0
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.tee $1
  i32.const 16
  i32.sub
  local.get $2
  i32.eq
  select
  if
   local.get $2
   i32.load $0
   local.set $3
   local.get $1
   i32.const 16
   i32.sub
   local.set $1
  end
  local.get $1
  i32.sub
  local.tee $2
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $3
  i32.const 2
  i32.and
  local.get $2
  i32.const 8
  i32.sub
  local.tee $2
  i32.const 1
  i32.or
  i32.or
  i32.store $0
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  i32.const 0
  i32.store $0 offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  local.tee $2
  i32.const 2
  i32.store $0
  local.get $0
  local.get $2
  i32.store $0 offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
  (local $1 i32)
  memory.size $0
  local.tee $0
  i32.const 0
  i32.le_s
  if (result i32)
   i32.const 1
   local.get $0
   i32.sub
   memory.grow $0
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  i32.const 1424
  i32.const 0
  i32.store $0
  i32.const 2992
  i32.const 0
  i32.store $0
  loop $for-loop|0
   local.get $1
   i32.const 23
   i32.lt_u
   if
    local.get $1
    i32.const 2
    i32.shl
    i32.const 1424
    i32.add
    i32.const 0
    i32.store $0 offset=4
    i32.const 0
    local.set $0
    loop $for-loop|1
     local.get $0
     i32.const 16
     i32.lt_u
     if
      local.get $1
      i32.const 4
      i32.shl
      local.get $0
      i32.add
      i32.const 2
      i32.shl
      i32.const 1424
      i32.add
      i32.const 0
      i32.store $0 offset=96
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  i32.const 1424
  i32.const 2996
  memory.size $0
  i32.const 16
  i32.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 1424
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/tlsf/prepareSize (param $0 i32) (result i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1056
   i32.const 1184
   i32.const 458
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 12
  local.get $0
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.get $0
  i32.const 12
  i32.le_u
  select
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   local.get $1
   i32.const 1
   i32.const 27
   local.get $1
   i32.clz
   i32.sub
   i32.shl
   i32.add
   i32.const 1
   i32.sub
   local.get $1
   local.get $1
   i32.const 536870910
   i32.lt_u
   select
   local.tee $1
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $2
   local.get $1
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.set $1
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load $0 offset=96
  else
   local.get $0
   i32.load $0
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $0
    local.get $1
    i32.ctz
    local.tee $0
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=4
    i32.ctz
    local.get $0
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/tlsf/prepareBlock (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  i32.load $0
  local.tee $3
  i32.const -4
  i32.and
  local.get $2
  i32.sub
  local.tee $4
  i32.const 16
  i32.ge_u
  if
   local.get $1
   local.get $2
   local.get $3
   i32.const 2
   i32.and
   i32.or
   i32.store $0
   local.get $1
   i32.const 4
   i32.add
   local.get $2
   i32.add
   local.tee $1
   local.get $4
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store $0
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $1
   local.get $3
   i32.const -2
   i32.and
   i32.store $0
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $0
   local.get $0
   i32.load $0
   i32.const -3
   i32.and
   i32.store $0
  end
 )
 (func $~lib/rt/tlsf/allocateBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/prepareSize
  local.tee $2
  call $~lib/rt/tlsf/searchBlock
  local.tee $1
  i32.eqz
  if
   memory.size $0
   local.tee $1
   i32.const 4
   local.get $0
   i32.load $0 offset=1568
   local.get $1
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   local.get $2
   i32.const 1
   i32.const 27
   local.get $2
   i32.clz
   i32.sub
   i32.shl
   i32.const 1
   i32.sub
   i32.add
   local.get $2
   local.get $2
   i32.const 536870910
   i32.lt_u
   select
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $1
   local.get $3
   i32.gt_s
   select
   memory.grow $0
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow $0
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $0
   local.get $1
   i32.const 16
   i32.shl
   memory.size $0
   i32.const 16
   i32.shl
   call $~lib/rt/tlsf/addMemory
   local.get $0
   local.get $2
   call $~lib/rt/tlsf/searchBlock
   local.set $1
  end
  local.get $1
  i32.load $0
  drop
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/removeBlock
  local.get $0
  local.get $1
  local.get $2
  call $~lib/rt/tlsf/prepareBlock
  local.get $1
 )
 (func $~lib/rt/tcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1056
   i32.const 1120
   i32.const 125
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $0
  i32.const 16
  i32.add
  call $~lib/rt/tlsf/allocateBlock
  local.tee $2
  local.get $1
  i32.store $0 offset=12
  local.get $2
  local.get $0
  i32.store $0 offset=16
  global.get $~lib/rt/tcms/fromSpace
  local.tee $0
  i32.load $0 offset=8
  local.set $1
  local.get $2
  local.get $0
  i32.store $0 offset=4
  local.get $2
  local.get $1
  i32.store $0 offset=8
  local.get $1
  local.get $2
  local.get $1
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  local.get $0
  local.get $2
  i32.store $0 offset=8
  global.get $~lib/rt/tcms/total
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/tcms/total
  local.get $2
  i32.const 20
  i32.add
 )
 (func $~lib/rt/__newArray (result i32)
  (local $0 i32)
  (local $1 i32)
  i32.const 4
  i32.const 1
  call $~lib/rt/tcms/__new
  local.set $1
  i32.const 16
  i32.const 4
  call $~lib/rt/tcms/__new
  local.tee $0
  local.get $1
  i32.store $0
  local.get $0
  local.get $1
  i32.store $0 offset=4
  local.get $0
  i32.const 4
  i32.store $0 offset=8
  local.get $0
  i32.const 4
  i32.store $0 offset=12
  local.get $0
 )
 (func $~lib/rt/tlsf/moveBlock (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $2
  call $~lib/rt/tlsf/allocateBlock
  local.tee $2
  i32.const 4
  i32.add
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load $0
  i32.const -4
  i32.and
  memory.copy $0 $0
  local.get $1
  i32.const 1420
  i32.ge_u
  if
   local.get $1
   local.get $1
   i32.load $0
   i32.const 1
   i32.or
   i32.store $0
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/insertBlock
  end
  local.get $2
 )
 (func $~lib/rt/tcms/__renew (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $0
  i32.const 20
  i32.sub
  local.set $2
  local.get $0
  i32.const 1420
  i32.lt_u
  if
   local.get $1
   local.get $2
   i32.load $0 offset=12
   call $~lib/rt/tcms/__new
   local.tee $3
   local.get $0
   local.get $1
   local.get $2
   i32.load $0 offset=16
   local.tee $0
   local.get $0
   local.get $1
   i32.gt_u
   select
   memory.copy $0 $0
   local.get $3
   return
  end
  local.get $1
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1056
   i32.const 1120
   i32.const 143
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/tcms/total
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.sub
  global.set $~lib/rt/tcms/total
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  local.get $1
  i32.const 16
  i32.add
  local.set $6
  local.get $0
  i32.const 16
  i32.sub
  local.tee $2
  i32.const 1420
  i32.lt_u
  if
   local.get $2
   i32.const 4
   i32.sub
   local.set $0
   local.get $2
   i32.const 15
   i32.and
   i32.const 1
   local.get $2
   select
   if (result i32)
    i32.const 1
   else
    local.get $0
    i32.load $0
    i32.const 1
    i32.and
   end
   drop
   global.get $~lib/rt/tlsf/ROOT
   local.get $0
   local.get $6
   call $~lib/rt/tlsf/moveBlock
   local.set $0
  else
   block $__inlined_func$~lib/rt/tlsf/reallocateBlock
    local.get $2
    i32.const 4
    i32.sub
    local.set $0
    local.get $2
    i32.const 15
    i32.and
    i32.const 1
    local.get $2
    select
    if (result i32)
     i32.const 1
    else
     local.get $0
     i32.load $0
     i32.const 1
     i32.and
    end
    drop
    global.get $~lib/rt/tlsf/ROOT
    local.set $3
    local.get $6
    call $~lib/rt/tlsf/prepareSize
    local.tee $4
    local.get $0
    i32.load $0
    local.tee $7
    i32.const -4
    i32.and
    local.tee $5
    i32.le_u
    if
     local.get $3
     local.get $0
     local.get $4
     call $~lib/rt/tlsf/prepareBlock
     br $__inlined_func$~lib/rt/tlsf/reallocateBlock
    end
    local.get $0
    i32.const 4
    i32.add
    local.get $0
    i32.load $0
    i32.const -4
    i32.and
    i32.add
    local.tee $2
    i32.load $0
    local.tee $8
    i32.const 1
    i32.and
    if
     local.get $5
     i32.const 4
     i32.add
     local.get $8
     i32.const -4
     i32.and
     i32.add
     local.tee $5
     local.get $4
     i32.ge_u
     if
      local.get $3
      local.get $2
      call $~lib/rt/tlsf/removeBlock
      local.get $0
      local.get $7
      i32.const 3
      i32.and
      local.get $5
      i32.or
      i32.store $0
      local.get $3
      local.get $0
      local.get $4
      call $~lib/rt/tlsf/prepareBlock
      br $__inlined_func$~lib/rt/tlsf/reallocateBlock
     end
    end
    local.get $3
    local.get $0
    local.get $6
    call $~lib/rt/tlsf/moveBlock
    local.set $0
   end
  end
  local.get $0
  i32.const 20
  i32.add
  local.tee $0
  i32.const 20
  i32.sub
  local.tee $2
  local.get $1
  i32.store $0 offset=16
  local.get $2
  i32.load $0 offset=4
  i32.const -4
  i32.and
  local.get $2
  i32.store $0 offset=8
  local.get $2
  i32.load $0 offset=8
  local.tee $1
  local.get $2
  local.get $1
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  global.get $~lib/rt/tcms/total
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/tcms/total
  local.get $0
 )
 (func $~lib/array/Array<u8>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  local.get $0
  i32.load $0 offset=12
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 1280
    i32.const 1344
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 1
   i32.add
   local.tee $5
   local.get $0
   i32.load $0 offset=8
   local.tee $3
   i32.gt_u
   if
    local.get $5
    i32.const 1073741820
    i32.gt_u
    if
     i32.const 1392
     i32.const 1344
     i32.const 19
     i32.const 48
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.load $0
    local.tee $4
    i32.const 1073741820
    local.get $3
    i32.const 1
    i32.shl
    local.tee $6
    local.get $6
    i32.const 1073741820
    i32.ge_u
    select
    local.tee $6
    i32.const 8
    local.get $5
    local.get $5
    i32.const 8
    i32.le_u
    select
    local.tee $5
    local.get $5
    local.get $6
    i32.lt_u
    select
    local.tee $5
    call $~lib/rt/tcms/__renew
    local.tee $6
    local.get $3
    i32.add
    i32.const 0
    local.get $5
    local.get $3
    i32.sub
    memory.fill $0
    local.get $4
    local.get $6
    i32.ne
    if
     local.get $0
     local.get $6
     i32.store $0
     local.get $0
     local.get $6
     i32.store $0 offset=4
    end
    local.get $0
    local.get $5
    i32.store $0 offset=8
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.store $0 offset=12
  end
  local.get $1
  local.get $0
  i32.load $0 offset=4
  i32.add
  local.get $2
  i32.store8 $0
 )
 (func $~lib/array/Array<u8>#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load $0 offset=12
  i32.ge_u
  if
   i32.const 1280
   i32.const 1344
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.add
  i32.load8_u $0
 )
 (func $assembly/index/makeARGB (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $1
  i32.const 2
  i32.shl
  local.tee $8
  i32.const -16
  i32.and
  local.set $4
  loop $for-loop|0
   local.get $2
   local.get $7
   i32.gt_u
   if
    i32.const 0
    local.get $7
    local.get $1
    i32.const 1
    local.get $0
    local.get $7
    local.get $8
    i32.mul
    i32.add
    call $assembly/env/getPixelPack
    local.set $9
    i32.const 0
    local.set $3
    loop $for-loop|1
     local.get $3
     local.get $4
     i32.lt_u
     if
      local.get $3
      local.get $9
      i32.add
      local.tee $5
      local.get $5
      v128.load $0
      v128.const i32x4 0x02010003 0x06050407 0x0a09080b 0x0e0d0c0f
      i8x16.swizzle
      v128.store $0
      local.get $3
      i32.const 16
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    local.get $4
    local.set $3
    loop $for-loop|2
     local.get $3
     local.get $8
     i32.lt_u
     if
      call $~lib/rt/__newArray
      local.tee $6
      i32.load $0 offset=4
      drop
      local.get $6
      i32.const 0
      local.get $3
      local.get $9
      i32.add
      local.tee $5
      i32.load8_u $0 offset=3
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 1
      local.get $5
      i32.load8_u $0
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 2
      local.get $5
      i32.load8_u $0 offset=1
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 3
      local.get $5
      i32.load8_u $0 offset=2
      call $~lib/array/Array<u8>#__set
      local.get $5
      local.get $6
      i32.const 0
      call $~lib/array/Array<u8>#__get
      i32.store8 $0
      local.get $5
      local.get $6
      i32.const 1
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=1
      local.get $5
      local.get $6
      i32.const 2
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=2
      local.get $5
      local.get $6
      i32.const 3
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=3
      local.get $3
      i32.const 4
      i32.add
      local.set $3
      br $for-loop|2
     end
    end
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/makeBGRA (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $1
  i32.const 2
  i32.shl
  local.tee $8
  i32.const -16
  i32.and
  local.set $4
  loop $for-loop|0
   local.get $2
   local.get $7
   i32.gt_u
   if
    i32.const 0
    local.get $7
    local.get $1
    i32.const 1
    local.get $0
    local.get $7
    local.get $8
    i32.mul
    i32.add
    call $assembly/env/getPixelPack
    local.set $9
    i32.const 0
    local.set $3
    loop $for-loop|1
     local.get $3
     local.get $4
     i32.lt_u
     if
      local.get $3
      local.get $9
      i32.add
      local.tee $5
      local.get $5
      v128.load $0
      v128.const i32x4 0x03000102 0x07040605 0x0b08090a 0x0f0c0d0e
      i8x16.swizzle
      v128.store $0
      local.get $3
      i32.const 16
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    local.get $4
    local.set $3
    loop $for-loop|2
     local.get $3
     local.get $8
     i32.lt_u
     if
      call $~lib/rt/__newArray
      local.tee $6
      i32.load $0 offset=4
      drop
      local.get $6
      i32.const 0
      local.get $3
      local.get $9
      i32.add
      local.tee $5
      i32.load8_u $0 offset=2
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 1
      local.get $5
      i32.load8_u $0 offset=1
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 2
      local.get $5
      i32.load8_u $0
      call $~lib/array/Array<u8>#__set
      local.get $6
      i32.const 3
      local.get $5
      i32.load8_u $0 offset=3
      call $~lib/array/Array<u8>#__set
      local.get $5
      local.get $6
      i32.const 0
      call $~lib/array/Array<u8>#__get
      i32.store8 $0
      local.get $5
      local.get $6
      i32.const 1
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=1
      local.get $5
      local.get $6
      i32.const 2
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=2
      local.get $5
      local.get $6
      i32.const 3
      call $~lib/array/Array<u8>#__get
      i32.store8 $0 offset=3
      local.get $3
      i32.const 4
      i32.add
      local.set $3
      br $for-loop|2
     end
    end
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/makeRGBA (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  i32.const 2
  i32.shl
  local.set $4
  loop $for-loop|0
   local.get $2
   local.get $3
   i32.gt_u
   if
    i32.const 0
    local.get $3
    local.get $1
    i32.const 1
    local.get $0
    local.get $3
    local.get $4
    i32.mul
    i32.add
    call $assembly/env/getPixelPack
    drop
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/premakeA (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $2
  i32.const 2
  i32.shl
  local.tee $7
  i32.const -16
  i32.and
  local.set $5
  loop $for-loop|0
   local.get $3
   local.get $6
   i32.gt_u
   if
    local.get $0
    local.get $6
    local.get $7
    i32.const 6
    i32.add
    i32.mul
    i32.add
    local.tee $8
    i32.const 0
    i32.store8 $0 offset=5
    i32.const 0
    local.get $6
    local.get $2
    i32.const 1
    local.get $1
    call $assembly/env/getPixelPack
    drop
    i32.const 0
    local.set $4
    loop $for-loop|1
     local.get $4
     local.get $5
     i32.lt_u
     if
      local.get $8
      i32.const 6
      i32.add
      local.get $4
      i32.add
      local.get $1
      local.get $4
      i32.add
      v128.load $0
      v128.const i32x4 0x000000ff 0x000000ff 0x000000ff 0x000000ff
      v128.and
      i32.const 24
      i32x4.shl
      v128.store $0
      local.get $4
      i32.const 16
      i32.add
      local.set $4
      br $for-loop|1
     end
    end
    local.get $5
    local.set $4
    loop $for-loop|2
     local.get $4
     local.get $7
     i32.lt_u
     if
      local.get $8
      i32.const 6
      i32.add
      local.get $4
      i32.add
      local.get $1
      local.get $4
      i32.add
      i32.load $0
      i32.const 255
      i32.and
      i32.const 24
      i32.shl
      i32.store $0
      local.get $4
      i32.const 4
      i32.add
      local.set $4
      br $for-loop|2
     end
    end
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/makePNGData (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 v128)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 v128)
  (local $11 v128)
  (local $12 i32)
  (local $13 v128)
  (local $14 v128)
  (local $15 i32)
  i32.const 1
  local.set $6
  local.get $2
  i32.const 2
  i32.shl
  local.tee $12
  i32.const 1
  i32.add
  local.set $9
  loop $for-loop|0
   local.get $3
   local.get $8
   i32.gt_u
   if
    local.get $0
    local.get $8
    local.get $12
    i32.const 6
    i32.add
    i32.mul
    i32.add
    local.tee $7
    local.get $3
    i32.const 1
    i32.sub
    local.get $8
    i32.eq
    i32.store8 $0
    local.get $7
    local.get $9
    i32.store16 $0 offset=1
    local.get $7
    local.get $9
    i32.const -1
    i32.xor
    i32.store16 $0 offset=3
    local.get $7
    i32.const 0
    i32.store8 $0 offset=5
    i32.const 0
    local.get $8
    local.get $2
    i32.const 1
    local.get $7
    i32.const 6
    i32.add
    call $assembly/env/getPixelPack
    drop
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.get $9
    i32.const 5
    i32.shr_u
    local.tee $1
    local.get $6
    i32.mul
    i32x4.replace_lane 0
    local.set $10
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.set $4
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.get $5
    i32x4.replace_lane 0
    local.set $11
    local.get $1
    i32.const 5
    i32.shl
    local.set $1
    i32.const 0
    local.set $5
    loop $for-loop|1
     local.get $1
     local.get $5
     i32.gt_u
     if
      local.get $10
      local.get $4
      i32x4.add
      local.set $10
      local.get $4
      local.get $7
      i32.const 5
      i32.add
      local.get $5
      i32.add
      local.tee $15
      v128.load $0
      local.tee $13
      i16x8.extadd_pairwise_i8x16_u
      i32x4.extadd_pairwise_i16x8_u
      i32x4.add
      local.get $15
      v128.load $0 offset=16
      local.tee $14
      i16x8.extadd_pairwise_i8x16_u
      i32x4.extadd_pairwise_i16x8_u
      i32x4.add
      local.set $4
      local.get $11
      local.get $13
      i16x8.extend_low_i8x16_u
      v128.const i32x4 0x001f0020 0x001d001e 0x001b001c 0x0019001a
      i32x4.dot_i16x8_s
      local.get $13
      i16x8.extend_high_i8x16_u
      v128.const i32x4 0x00170018 0x00150016 0x00130014 0x00110012
      i32x4.dot_i16x8_s
      i32x4.add
      i32x4.add
      local.get $14
      i16x8.extend_low_i8x16_u
      v128.const i32x4 0x000f0010 0x000d000e 0x000b000c 0x0009000a
      i32x4.dot_i16x8_s
      local.get $14
      i16x8.extend_high_i8x16_u
      v128.const i32x4 0x00070008 0x00050006 0x00030004 0x00010002
      i32x4.dot_i16x8_s
      i32x4.add
      i32x4.add
      local.set $11
      local.get $5
      i32.const 32
      i32.add
      local.set $5
      br $for-loop|1
     end
    end
    local.get $6
    local.get $4
    local.get $4
    v128.const i32x4 0x0b0a0908 0x0f0e0d0c 0x03020100 0x07060504
    i8x16.swizzle
    i32x4.add
    local.tee $4
    local.get $4
    v128.const i32x4 0x07060504 0x03020100 0x0f0e0d0c 0x0b0a0908
    i8x16.swizzle
    i32x4.add
    i32x4.extract_lane 0
    i32.add
    i32.const 65521
    i32.rem_u
    local.set $6
    local.get $11
    local.get $10
    i32.const 5
    i32x4.shl
    i32x4.add
    local.tee $4
    local.get $4
    v128.const i32x4 0x0b0a0908 0x0f0e0d0c 0x03020100 0x07060504
    i8x16.swizzle
    i32x4.add
    local.tee $4
    local.get $4
    v128.const i32x4 0x07060504 0x03020100 0x0f0e0d0c 0x0b0a0908
    i8x16.swizzle
    i32x4.add
    i32x4.extract_lane 0
    i32.const 65521
    i32.rem_u
    local.set $5
    loop $for-loop|2
     local.get $1
     local.get $9
     i32.lt_u
     if
      local.get $5
      local.get $6
      local.get $7
      i32.const 5
      i32.add
      local.get $1
      i32.add
      i32.load8_u $0
      i32.add
      local.tee $6
      i32.add
      local.set $5
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|2
     end
    end
    local.get $6
    i32.const 65521
    i32.sub
    local.get $6
    local.get $6
    i32.const 65521
    i32.ge_u
    select
    i32.const 65521
    i32.rem_u
    local.set $6
    local.get $5
    i32.const 65521
    i32.rem_u
    local.set $5
    local.get $8
    i32.const 1
    i32.add
    local.set $8
    br $for-loop|0
   end
  end
  local.get $0
  local.get $3
  local.get $12
  i32.const 6
  i32.add
  i32.mul
  i32.add
  local.get $5
  i32.const 16
  i32.shl
  local.get $6
  i32.or
  local.tee $0
  i32.const -16711936
  i32.and
  i32.const 8
  i32.rotl
  local.get $0
  i32.const 16711935
  i32.and
  i32.const 8
  i32.rotr
  i32.or
  i32.store $0
 )
 (func $assembly/index/makePNGData_RGBX32 (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 v128)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 v128)
  (local $13 i32)
  (local $14 i32)
  (local $15 v128)
  (local $16 v128)
  (local $17 v128)
  i32.const 1
  local.set $9
  local.get $2
  i32.const 2
  i32.shl
  local.tee $13
  i32.const 1
  i32.add
  local.set $14
  local.get $13
  i32.const -16
  i32.and
  local.set $5
  loop $for-loop|0
   local.get $3
   local.get $11
   i32.gt_u
   if
    local.get $0
    local.get $11
    local.get $13
    i32.const 6
    i32.add
    i32.mul
    i32.add
    local.tee $10
    local.get $3
    i32.const 1
    i32.sub
    local.get $11
    i32.eq
    i32.store8 $0
    local.get $10
    local.get $14
    i32.store16 $0 offset=1
    local.get $10
    local.get $14
    i32.const -1
    i32.xor
    i32.store16 $0 offset=3
    local.get $10
    i32.const 0
    i32.store8 $0 offset=5
    i32.const 0
    local.get $11
    local.get $2
    i32.const 1
    local.get $1
    call $assembly/env/getPixelPack
    drop
    i32.const 0
    local.set $4
    loop $for-loop|1
     local.get $4
     local.get $5
     i32.lt_u
     if
      local.get $10
      i32.const 6
      i32.add
      local.get $4
      i32.add
      local.tee $7
      local.get $7
      v128.load $0
      local.get $1
      local.get $4
      i32.add
      v128.load $0
      v128.const i32x4 0x00ffffff 0x00ffffff 0x00ffffff 0x00ffffff
      v128.and
      v128.or
      v128.store $0
      local.get $4
      i32.const 16
      i32.add
      local.set $4
      br $for-loop|1
     end
    end
    local.get $5
    local.set $4
    loop $for-loop|2
     local.get $4
     local.get $13
     i32.lt_u
     if
      local.get $10
      i32.const 6
      i32.add
      local.get $4
      i32.add
      local.tee $7
      local.get $7
      i32.load $0
      local.get $1
      local.get $4
      i32.add
      i32.load $0
      i32.const 16777215
      i32.and
      i32.or
      i32.store $0
      local.get $4
      i32.const 4
      i32.add
      local.set $4
      br $for-loop|2
     end
    end
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.get $14
    i32.const 5
    i32.shr_u
    local.tee $4
    local.get $9
    i32.mul
    i32x4.replace_lane 0
    local.set $15
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.set $12
    v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
    local.get $8
    i32x4.replace_lane 0
    local.set $16
    local.get $4
    i32.const 5
    i32.shl
    local.set $4
    i32.const 0
    local.set $8
    loop $for-loop|3
     local.get $4
     local.get $8
     i32.gt_u
     if
      local.get $15
      local.get $12
      i32x4.add
      local.set $15
      local.get $12
      local.get $10
      i32.const 5
      i32.add
      local.get $8
      i32.add
      local.tee $7
      v128.load $0
      local.tee $17
      i16x8.extadd_pairwise_i8x16_u
      i32x4.extadd_pairwise_i16x8_u
      i32x4.add
      local.get $7
      v128.load $0 offset=16
      local.tee $6
      i16x8.extadd_pairwise_i8x16_u
      i32x4.extadd_pairwise_i16x8_u
      i32x4.add
      local.set $12
      local.get $16
      local.get $17
      i16x8.extend_low_i8x16_u
      v128.const i32x4 0x001f0020 0x001d001e 0x001b001c 0x0019001a
      i32x4.dot_i16x8_s
      local.get $17
      i16x8.extend_high_i8x16_u
      v128.const i32x4 0x00170018 0x00150016 0x00130014 0x00110012
      i32x4.dot_i16x8_s
      i32x4.add
      i32x4.add
      local.get $6
      i16x8.extend_low_i8x16_u
      v128.const i32x4 0x000f0010 0x000d000e 0x000b000c 0x0009000a
      i32x4.dot_i16x8_s
      local.get $6
      i16x8.extend_high_i8x16_u
      v128.const i32x4 0x00070008 0x00050006 0x00030004 0x00010002
      i32x4.dot_i16x8_s
      i32x4.add
      i32x4.add
      local.set $16
      local.get $8
      i32.const 32
      i32.add
      local.set $8
      br $for-loop|3
     end
    end
    local.get $9
    local.get $12
    local.get $12
    v128.const i32x4 0x0b0a0908 0x0f0e0d0c 0x03020100 0x07060504
    i8x16.swizzle
    i32x4.add
    local.tee $6
    local.get $6
    v128.const i32x4 0x07060504 0x03020100 0x0f0e0d0c 0x0b0a0908
    i8x16.swizzle
    i32x4.add
    i32x4.extract_lane 0
    i32.add
    i32.const 65521
    i32.rem_u
    local.set $9
    local.get $16
    local.get $15
    i32.const 5
    i32x4.shl
    i32x4.add
    local.tee $6
    local.get $6
    v128.const i32x4 0x0b0a0908 0x0f0e0d0c 0x03020100 0x07060504
    i8x16.swizzle
    i32x4.add
    local.tee $6
    local.get $6
    v128.const i32x4 0x07060504 0x03020100 0x0f0e0d0c 0x0b0a0908
    i8x16.swizzle
    i32x4.add
    i32x4.extract_lane 0
    i32.const 65521
    i32.rem_u
    local.set $8
    loop $for-loop|4
     local.get $4
     local.get $14
     i32.lt_u
     if
      local.get $8
      local.get $9
      local.get $10
      i32.const 5
      i32.add
      local.get $4
      i32.add
      i32.load8_u $0
      i32.add
      local.tee $9
      i32.add
      local.set $8
      local.get $4
      i32.const 1
      i32.add
      local.set $4
      br $for-loop|4
     end
    end
    local.get $9
    i32.const 65521
    i32.sub
    local.get $9
    local.get $9
    i32.const 65521
    i32.ge_u
    select
    i32.const 65521
    i32.rem_u
    local.set $9
    local.get $8
    i32.const 65521
    i32.rem_u
    local.set $8
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $for-loop|0
   end
  end
  local.get $0
  local.get $3
  local.get $13
  i32.const 6
  i32.add
  i32.mul
  i32.add
  local.get $8
  i32.const 16
  i32.shl
  local.get $9
  i32.or
  local.tee $0
  i32.const -16711936
  i32.and
  i32.const 8
  i32.rotl
  local.get $0
  i32.const 16711935
  i32.and
  i32.const 8
  i32.rotr
  i32.or
  i32.store $0
 )
 (func $assembly/index/alloc (param $0 i32) (result i32)
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $0
  call $~lib/rt/tlsf/allocateBlock
  i32.const 4
  i32.add
 )
 (func $assembly/index/free (param $0 i32)
  (local $1 i32)
  local.get $0
  i32.const 1420
  i32.ge_u
  if
   global.get $~lib/rt/tlsf/ROOT
   i32.eqz
   if
    call $~lib/rt/tlsf/initialize
   end
   local.get $0
   i32.const 4
   i32.sub
   local.set $1
   local.get $0
   i32.const 15
   i32.and
   i32.const 1
   local.get $0
   select
   if (result i32)
    i32.const 1
   else
    local.get $1
    i32.load $0
    i32.const 1
    i32.and
   end
   drop
   local.get $1
   local.get $1
   i32.load $0
   i32.const 1
   i32.or
   i32.store $0
   global.get $~lib/rt/tlsf/ROOT
   local.get $1
   call $~lib/rt/tlsf/insertBlock
  end
 )
 (func $~start
  i32.const 1236
  i32.const 1232
  i32.store $0
  i32.const 1240
  i32.const 1232
  i32.store $0
  i32.const 1232
  global.set $~lib/rt/tcms/fromSpace
 )
)
