::@echo off
:loop
call git push --all
timeout /T 5 /NOBREAK
goto loop
