
#!/bin/bash

citations_dir=/home/claudius/workspace/repositories/git/citada-data/

total_citations=$(grep -rl "$1" "$citations_dir" | wc -l)
corrected_citations=$(grep -rl "$1" "$citations_dir" | while read n; do grep -l "corrected" "$n"; done | wc -l)
grep -rl "$1" "$citations_dir" | while read n; do grep -l "corrected" "$n"; done | xargs sed -i 's/"redactor"/"former-redactor"/g'

echo "$(($total_citations - $corrected_citations))"

#count number
# ... | wc -l
