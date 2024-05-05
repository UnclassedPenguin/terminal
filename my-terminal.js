const directories = {
    education: [
        '',
        '<white>education</white>',

        '* <a href="https://en.wikipedia.org/wiki/Kielce_University_of_Technology">Kielce University of Technology</a> <yellow>"Computer Science"</yellow> 2002-2007 / 2011-2014',
        '* <a href="https://pl.wikipedia.org/wiki/Szko%C5%82a_policealna">Post-secondary</a> Electronic School <yellow>"Computer Systems"</yellow> 2000-2002',
        '* Electronic <a href="https://en.wikipedia.org/wiki/Technikum_(Polish_education)">Technikum</a> with major <yellow>"RTV"</yellow> 1995-2000',
        ''
    ],
    projects: [
        '',
        '<white>Open Source projects</white>',
        [
            ['jQuery Terminal',
             'https://terminal.jcubic.pl',
             'library that adds terminal interface to websites'
            ],
            ['LIPS Scheme',
             'https://lips.js.org',
             'Scheme implementation in JavaScript'
            ],
            ['Sysend.js',
             'https://jcu.bi/sysend',
             'Communication between open tabs'
            ],
            ['Wayne',
             'https://jcu.bi/wayne',
             'Pure in browser HTTP requests'
            ],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',

        [
            'JavaScript',
            'TypeScript',
            'Python',
            'SQL',
            'PHP',
            'Bash'
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        [
            'React.js',
            'Redux',
            'Jest',
        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        [
            'Docker',
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const root = '~';
let cwd = root;

const user = 'guest';
const server = 'unclassed.ca';

$.terminal.xml_formatter.tags.green = (attrs) => {
    return `[[;#44D544;]`;
};
$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};

const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    term.echo(args.join(' '));
  },
  //ls(dir = null) {
    //if (cwd === root) {
      //term.echo(`directory thing`);
    //}
  //},
 ls(dir = null) {
    if (dir) {
      if (dir.startsWith('~/')) {
        const path = dir.substring(2);
        const dirs = path.split('/');
        if (dirs.length > 1) {
          this.error('Invalid directory');
        } else {
          const dir = dirs[0];
          this.echo(directories[dir].join('\n'));
        }
      } else if (cwd === root) {
        if (dir in directories) {
           this.echo(directories[dir].join('\n'));
        } else {
          this.error('Invalid directory');
        }
      } else if (dir === '..') {
          print_dirs();
      } else {
          this.error('Invalid directory');
      }
    } else if (cwd === root) {
        print_dirs();
    } else {
      const dir = cwd.substring(2);
      this.echo(directories[dir].join('\n'));
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === '..' && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dirs.includes(dir)) {
      cwd = root + '/' + dir;
    } else {
      this.error('Wrong directory');
    }
  }
};

const greetings = 'Tylers Server';
const subgreetings = '';
const font = 'Slant';

function prompt() {
  return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

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
//const help = formatter.format(command_list);


const term = $('body').terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false,
  //completion: true,
  completion(string) {
    // in every function we can use this to reference term object
    const { name, rest } = $.terminal.parse_command(this.get_command());
    if (['cd', 'ls'].includes(name)) {
      if (rest.startsWith('~/')) {
        return dirs.map(dir => `~/${dir}`);
      }
      if (cwd === root) {
        return dirs;
      }
    }
    return Object.keys(commands);
  },
  prompt
});

term.on('click', '.command', function() {
     const command = $(this).text();
     term.exec(command);
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
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
    return `${ascii}\nWelcome to my Website! Type '<white>help</white>' for a list of commands.\nThis is based on a <a href="https://www.freecodecamp.org/news/how-to-create-interactive-terminal-based-portfolio/" target="_blank">Tutorial</a>, none of the information within is accurate to me!\n`;
  });
}
