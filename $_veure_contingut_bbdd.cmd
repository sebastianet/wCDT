call $_set_envir.cmd
echo BBDD = (%BBDD%)
echo COLE = (%COLE%)
c:\mongodb\bin\mongoexport -d %BBDD%  -c %COLE%