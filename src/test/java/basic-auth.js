function fn() {
    let temp = 'webtester:Dctm1234';
    let Base64 = Java.type('java.util.Base64');
    let encoded = Base64.getEncoder().encodeToString(temp.toString().getBytes());
    return 'Basic ' + encoded;
}