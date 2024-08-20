let code = document.getElementById("code");

let btn = document.querySelector("#btn");

let output = document.getElementById("output");

let lang = document.getElementById("lan");

const idObject = {
    python: "0",
    javascript: "4",
    c : "7",
    cpp : "77",
    java: "8"
}

btn.addEventListener("click", function(){
    let language = lang.value;
    if(language in idObject){
        showOutput("");
        let codeContent = code.value;
        compileCode(codeContent, idObject[language]);
    }else{
        showOutput("Please select a language");
    }
})

function showOutput(code){
    output.innerText = code;
}

function compileCode(content, id){
    fetch("https://course.codequotient.com/api/executeCode",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({code: content, langId: id})
    }).then(function(response){
        if(response.error){
            throw Error("Code is incorrect");
        }
        return response.json();
    }).then(function(data){
        let codeId = data.codeId;
        let iteration=0;
        setInterval(function(){
            if(iteration<5){
                getOutput(codeId);
                iteration++;
            }else{
                clearInterval();
            }
        }, 2000);
    }).catch(function(err) {
        showOutput(err);
    });
}

function getOutput(codeId){
    fetch(`https://course.codequotient.com/api/codeResult/${codeId}`)
    .then(function(res){
        return res.json();
    })
    .then(function(result){
        let obj = JSON.parse(result.data);
        if(obj.errors){
            showOutput(obj.errors);
        }else{
            let actualOutput = obj.output.slice(8).trim();
            showOutput(actualOutput);
        }
    })
    .catch(function(err){
        console.log(err);
    })
}