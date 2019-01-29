const fs = require('fs')
const argv = require('yargs').argv
const ipRangeCheck = require("ip-range-check");
const net = require('net')

if (argv.ip == undefined) {
    console.log('usage:')
    console.log(`node index.js --ip=[IP_ADDRESS]`)
    process.exit(1)
}

const aws_ips_file_content = fs.readFileSync('aws-ip-ranges-json/ip-ranges.json')
const aws_ips = JSON.parse(aws_ips_file_content);

if (net.isIPv4(argv.ip)) {
    aws_ips.prefixes.forEach(element => {
        if (ipRangeCheck(argv.ip, element.ip_prefix)) {
            console.log(element);
            process.exit(0)
        }
     });     
} else if (net.isIPv6(argv.ip)) {
    aws_ips.ipv6_prefixes.forEach(element => {
        if (ipRangeCheck(argv.ip, element.ipv6_prefix)) {
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