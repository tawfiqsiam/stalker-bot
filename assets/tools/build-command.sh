#!/bin/bash
clear
cat << 'EOF'
____     _____ _        _ _               _____ ___  ________     ____
\ \ \   /  ___| |      | | |             /  __ \|  \/  |  _  \   / / /
 \ \ \  \ `--.| |_ __ _| | | _____ _ __  | /  \/| .  . | | | |  / / / 
  > > >  `--. \ __/ _` | | |/ / _ \ '__| | |    | |\/| | | | | < < <  
 / / /  /\__/ / || (_| | |   <  __/ |    | \__/\| |  | | |/ /   \ \ \ 
/_/_/   \____/ \__\__,_|_|_|\_\___|_|     \____/\_|  |_/___/     \_\_\
                                                                      
                                                                                                                            
EOF
sleep 2
echo
echo "<<< New Command Setup v.1.0 >>>"
echo
echo ">>> Enter new Command Name <<<"
read nameCmd
if [[ -z "$nameCmd" ]]; 
then
	echo "You have not entered any name, it will be left empty"
	touch ../commands/stk-[CommandName].js && cat ./template.txt >> ../commands/stk-[CommandName].js
	echo "New Command file generated **Please remember change the default file name**" 
else
	touch ../commands/stk-$nameCmd.js && cat ./template.txt >> ../commands/stk-$nameCmd.js
	echo "New Command file generated with name: "$nameCmd 
fi
sleep 5
exit