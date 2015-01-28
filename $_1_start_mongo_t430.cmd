call $_set_envir.cmd
echo BBDD = (%BBDD%)
echo COLE = (%COLE%)
start "MongoDB for CDT demo - BBDD=CDT, COLE=RESERVES_PISTES"  c:\mongodb\bin\mongod.exe  --rest  --config c:\Sebas\JavaScript\simple_web_server\mongod.cfg
