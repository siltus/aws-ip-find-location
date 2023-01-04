import yargs from 'yargs'
import check_many_cidrs from 'ip-range-check' 
import net from 'net'
import axios from 'axios'

let argv = yargs(process.argv.slice(2)).argv

if (argv.ip == undefined) {
    console.log('usage:')
    console.log(`node index.js --ip=[IP_ADDRESS]`)
    process.exit(1)
}

const aws_ips_official = await axios.get(
    `https://ip-ranges.amazonaws.com/ip-ranges.json`
);

const aws_ips = aws_ips_official.data;

if (net.isIPv4(argv.ip)) {
    aws_ips.prefixes.forEach(element => {
        if (check_many_cidrs(argv.ip, element.ip_prefix)) {
            console.log(element);
            process.exit(0)
        }
     });     
} else if (net.isIPv6(argv.ip)) {
    aws_ips.ipv6_prefixes.forEach(element => {
        if (check_many_cidrs(argv.ip, element.ipv6_prefix)) {
            console.log(element);
            process.exit(0)
        }
        });   
} else {
    console.log('input is not a valid IPv4/IPv6 address.')
    process.exit(1)
}


console.log('Not an AWS IP.');
process.exit(1)