// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "devops", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showBackSkills(skills) {
    let skillsContainer = document.getElementById("back-skills-container");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showBackSkills(skills) {
    let skillsContainer = document.getElementById("back-skills-container");
    let skillHTML = `<h3 class="skills-title"> Back-end </h3>
                     <div class="row">`;
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillHTML += "</div>"
    skillsContainer.innerHTML = skillHTML;
}

function showFrontSkills(skills) {
    let skillsContainer = document.getElementById("front-skills-container");
    let skillHTML = `<h3 class="skills-title"> Front-end </h3>
                     <div class="row">`;
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillHTML += "</div>"
    skillsContainer.innerHTML = skillHTML;
}

function showDevopsSkills(skills) {
    let skillsContainer = document.getElementById("devops-skills-container");
    let skillHTML = `<h3 class="skills-title"> Dev ops </h3>
                     <div class="row">`;
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillHTML += "</div>"
    skillsContainer.innerHTML = skillHTML;
}

fetchData().then(data => {
    showBackSkills(data[0]);
    showFrontSkills(data[1]);
    showDevopsSkills(data[2]);
});