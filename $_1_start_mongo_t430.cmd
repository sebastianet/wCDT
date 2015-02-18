call $_set_envir.cmd
echo BBDD = (%BBDD%)
echo COLE = (%COLE%)
start "MongoDB for CDT demo at T430 - BBDD=CDT, COLE=RESERVES_PISTES"  c:\mongodb\bin\mongod.exe  --rest  --config c:\Sebas\JavaScript\wCDT\mongod_t430.cfg
