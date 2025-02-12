const fs = require('fs');
const yaml = require('yaml');

function ReadYamlFile(filePath) {
    try {
        // Read the file synchronously
        const fileContents = fs.readFileSync(filePath, 'utf8');
        
        return ReadYaml(fileContents);
    } catch (error) {
        console.error(`Error reading YAML file: ${error.message}`);
        return null;  // Return null or handle the error as needed
    }
}

function ReadYaml(yamlTxt){
    try {
        // Parse the YAML content
        const data = yaml.parse(yamlTxt);
        
        return data;  // Return the parsed data
    } catch (error) {
        console.error(`Error parsing YAML content: ${error.message}`);
        return null;  // Return null or handle the error as needed
    }
}

module.exports = {
    ReadYamlFile,
    ReadYaml
}