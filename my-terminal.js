const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    term.echo(args.join(' '));
  }
};

const greetings = 'Tylers Server';
const subgreetings = '';
const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

//const command_list = Object.keys(commands);
const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => {
  return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(formatted_list);


const term = $('body').terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false
});

term.on('click', '.command', function() {
     const command = $(this).text();
     term.exec(command);
});

function render(text) {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true
  });
}

function ready() {
  term.echo(() => {
    const ascii = render([greetings]);
    return `${ascii}\nWelcome to my Website! Type 'help' for a list of commands.\n`;
  });
}
