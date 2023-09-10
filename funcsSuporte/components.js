const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    row(opts) {
        if (opts.data.type == 3) {
            let SelectMenu = new StringSelectMenuBuilder()
                .setPlaceholder(opts.data.placeholder)
                .setCustomId(opts.data.custom_id)
                .setMinValues(opts.data.min_values)
                .setMaxValues(opts.data.max_values)
            for (const i of opts.data.options) {
                SelectMenu.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(i.label)
                        .setValue(i.value)
                )
            }
            return new ActionRowBuilder()
                .addComponents(SelectMenu)
        }
    },
    creatorButtons(array) {
        let actionRow = new ActionRowBuilder()
        const actions = []
        for (const a of array) {
            if (actionRow.components.length == 5){
                actions.push(actionRow)
                actionRow = new ActionRowBuilder()
            }
            if (a.url) {
                actionRow
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(a.label)
                            .setStyle(ButtonStyle.Link)
                            .setURL(a.url)
                    )
            } else {
                actionRow
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(a.customId)
                            .setLabel(a.label)
                            .setStyle(a.style)
                            .setDisabled((a.setDisabled) ? a.setDisabled: false)
                    )
            }
        }
        actions.push(actionRow)
        return actions
    }
}