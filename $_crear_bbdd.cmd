call $_set_envir.cmd
echo BBDD = (%BBDD%)
echo COLE = (%COLE%)
c:\mongodb\bin\mongo localhost:27017/%BBDD% --quiet $_crear_bbdd_dades.js