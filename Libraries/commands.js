/**
 * Client command library.
 */
var commands = [{
    name: "fps",
    usage: "~fps [on/off]",
    category: "Diagnostics",
    description: "Enables or disables the frames-per-second display.",
    execute: function (parameters, user)
    {
        if (parameters[0] == "on")
        {
            gb_fps_on = true;
        } else if (parameters[0] == "off")
        {
            gb_fps_on = false;
        } else
        {
            return `<ul><li><h4>Invalid Parameter</h4><span style="font-weight:300;">Try <b>\"on\"</b> or <b>\"off\"</b>.</span></li></ul>`;
        }
        var message = `
            <ul>
                <li> <h4>FPS Display</h4> <span style="font-weight:300;">${gb_fps_on ? "on" : "off"}</span></li>
            </ul>`;
        return message;
    }
},
{
    name: "me",
    usage: "~me",
    category: "User",
    description: "Shows your user ID, face number, and color number.",
    execute: function (parameters, user)
    {
        var message = `
            <ul>
            <li><h4>Name</h4> <span style="font-weight:300;">${user.name}</span></li>
            <li><h4>ID</h4> <span style="font-weight:300;">${user.userID}</span></li>
            <li><h4>Face #</h4> <span style="font-weight:300;">${user.faceNbr}</span></li>
            <li><h4>Color #</h4> <span style="font-weight:300;">${user.colorNbr + " : <span style='color:" + userColorHex(user.colorNbr) + "'>" + userColorHex(user.colorNbr)}</span></li>
            </ul>
            `;
        return message;
    }
},
{
    name: "color",
    usage: "~color [color number]",
    category: "User",
    description: "Changes your user color. [0-15]",
    execute: function (parameters, user)
    {
        user.colorNbr = (Number(parameters[0]));
        var message = `
            <ul>
            <li><h4>Color #</h4> <span style="font-weight:300;">${user.colorNbr + " : <span style='color:" + userColorHex(user.colorNbr) + "'>" + userColorHex(user.colorNbr)}</span></li>
            </ul>
            `;
        return message;
    }
},
{
    name: "face",
    usage: "~face [color number]",
    category: "User",
    description: "Changes your user face. [0-15]",
    execute: function (parameters, user)
    {
        user.faceNbr = (Number(parameters[0]));
        var message = `
            <ul>
            <li><h4>Face #</h4> <span style="font-weight:300;">${user.faceNbr}</span></li>
            </ul>
            `;
        return message;
    }
},
{
    name: "help",
    usage: "~help [command]",
    category: "Misc",
    description: "Shows the list of commands, or detailed info about a specific command.",
    execute: function (parameters, user)
    {
        if (parameters[0])
        {
            var selectedCommand = commands.find(cmd => cmd.name === parameters[0]);
            if (selectedCommand)
            {
                var message = `
                    <ul>
                        <li><h4>Name</h4><span style="font-weight:300;">${selectedCommand.name}</span></li>
                        <li><h4>Usage</h4> <span style="font-weight:300;">${selectedCommand.usage}</span></li>
                        <li><h4>Category</h4> <span style="font-weight:300;">${selectedCommand.category}</span></li>
                        <li><h4>Description</h4> <span style="font-weight:300;">${selectedCommand.description}</span></li>
                    </ul>
                    `;
                return message;
            } else
            {
                return `<ul><li><span style="font-weight:300;">Command not found.</span></li></ul>`;
            }
        } else
        {
            var categorizedCommands = {};
            commands.forEach(cmd =>
            {
                if (!(cmd.category in categorizedCommands))
                {
                    categorizedCommands[cmd.category] = [];
                }
                categorizedCommands[cmd.category].push(cmd);
            });

            var message = `
                    ${Object.keys(categorizedCommands).map(category => `
                        <h4>${category}</h4>
                        <ul>
                            ${categorizedCommands[category].map(cmd => `
                                <li><span style="font-weight:300;">${cmd.usage}</span></li>
                            `).join('')}
                        </ul>
                    `).join('')}
                `;
            return message;
        }
    }
}

];

// --------------------------------------------------


/**
 * Executes client command.
 * @param {*} command 
 * @param {*} parameters 
 */
function executeCommand(command, parameters)
{
    var user = ga_users_room.find(user => user.userID == gi_user_id);
    var colorNbr = user.colorNbr;

    var selectedCommand = commands.find(cmd => cmd.name === command);

    if (selectedCommand)
    {
        var returnMessage = selectedCommand.execute(parameters, user);

        // Create a new div element for the message
        var newMsgDiv = document.createElement("div");
        newMsgDiv.classList.add("command-log-box", "fade-left");
        // newMsgDiv.style.borderLeft = "4px solid var(--client-color-1)";
        newMsgDiv.innerHTML = `
            <h3><i class="fa-solid fa-terminal"></i> ${selectedCommand.name} ${parameters}</h3>
            ${returnMessage}
        `;

        gb_log_bottom = ge_log.scrollHeight - ge_log.scrollTop <= ge_log.clientHeight + 5;
        ge_log.appendChild(newMsgDiv);
        if (gb_log_bottom)
        {
            ge_log.scrollTop = ge_log.scrollHeight;
        }
        if (ge_log_div.style.display == "none")
        {
            toggleDivVisibility(ge_log_div);
            toggleButtonColor(ge_log_button, ge_log_div);
        }


    } else
    {


        var newMsgDiv = document.createElement("div");
        newMsgDiv.classList.add("command-log-box", "fade-left");
        // newMsgDiv.style.borderLeft = "4px solid var(--client-color-1)";
        newMsgDiv.innerHTML = `<h3><i class="fa-solid fa-terminal"></i> ${command} ${parameters}</h3><ul><li><span style="font-weight:300;"><h4>Command not found.</h4> Try using the <b>~help</b> command.</span></li></ul>`

        gb_log_bottom = ge_log.scrollHeight - ge_log.scrollTop <= ge_log.clientHeight + 5;
        ge_log.appendChild(newMsgDiv);
        if (gb_log_bottom)
        {
            ge_log.scrollTop = ge_log.scrollHeight;
        }
        if (ge_log_div.style.display == "none")
        {
            toggleDivVisibility(ge_log_div);
            toggleButtonColor(ge_log_button, ge_log_div);
        }
    }
}