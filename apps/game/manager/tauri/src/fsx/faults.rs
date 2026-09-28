use std::path::Path;

use crate::error::AppResult;

#[cfg(test)]
thread_local! {
    static FAULT: std::cell::Cell<Option<(usize, std::io::ErrorKind)>> = const { std::cell::Cell::new(None) };
}

#[cfg(test)]
pub fn fail_after(operations: usize, kind: std::io::ErrorKind) {
    FAULT.set(Some((operations, kind)));
}

#[cfg(test)]
pub fn clear() {
    FAULT.set(None);
}

#[cfg(test)]
pub fn check(path: &Path) -> AppResult<()> {
    match FAULT.get() {
        Some((0, kind)) => {
            FAULT.set(None);

            Err(std::io::Error::new(kind, format!("injected fault at {}", path.display())).into())
        }
        Some((left, kind)) => {
            FAULT.set(Some((left - 1, kind)));

            Ok(())
        }
        None => Ok(()),
    }
}

#[cfg(not(test))]
pub fn check(_path: &Path) -> AppResult<()> {
    Ok(())
}
