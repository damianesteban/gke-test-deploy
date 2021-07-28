
#!/bin/bash


i=0
time dgoss run bhc.jfrog.io/docker/webapp:development-9-152be07 || ((i++))
time dgoss run -e DEBUG=true bhc.jfrog.io/docker/webapp:development-9-152be07 || ((i++))

exit $i