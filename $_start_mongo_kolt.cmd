call $_set_envir.cmd
echo BBDD = (%BBDD%)
echo COLE = (%COLE%)
echo c:\mongodb\bin\mongod.exe  --rest  --config c:\sag\node.js\simple_web_server\mongod_kolt.cfg
start "MongoDB for CDT demo - BBDD=CDT, COLE=RESERVES_PISTES"  c:\mongodb\bin\mongod.exe  --rest  --config c:\sag\node.js\simple_web_server\mongod_kolt.cfg
