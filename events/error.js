module.exports = (error) => {
    console.error("\n\n//////////////// CLIENT ERROR CAUGHT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
    console.error(" On:\t" +  new Date().toString().slice(0, 33));
    console.error(" Name:\t" + error.name);
    console.error(" Error:\t" + error.message);
    console.log("\n\n")
}