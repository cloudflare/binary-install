use clap::{App, Arg};
use console::Emoji;
use std::env;

fn main() {
    let matches = App::new(env!("CARGO_PKG_NAME"))
        .version(env!("CARGO_PKG_VERSION"))
        .about(env!("CARGO_PKG_DESCRIPTION"))
        .author(env!("CARGO_PKG_AUTHORS"))
        .arg(
            Arg::with_name("c")
                .short("c")
                .multiple(true)
                .help("Counts the number of -c arguments"),
        )
        .get_matches();

    let c_num = matches.occurrences_of("c");

    if c_num == 0 {
        println!("{} you didn't pass any -c arguments ", Emoji("🥺 ", ""))
    } else {
        println!("{} you passed {} -c arguments!", Emoji("🥰 ", ""), c_num);
    }
}
