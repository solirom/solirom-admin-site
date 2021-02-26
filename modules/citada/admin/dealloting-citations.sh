
#!/bin/bash

citations_dir=/home/claudius/workspace/repositories/git/citada-data/

#find "$citations_dir" -name "*" -print0 | xargs -0 grep -l $1 | xargs -0 grep "corrected"

grep -rl "$1" "$citations_dir" | while read n; do grep -l "corrected" "$n"; done | xargs sed -i 's/redactor/former-redactor/g'

#count number
# ... | wc -l
