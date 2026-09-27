use serde::ser::SerializeStruct;
use serde::{Serialize, Serializer};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ErrorCode {
    Io,
    Json,
    Http,
    ClientNotFound,
    ClientRunning,
    NotInstalled,
    UnknownComponent,
    RequiredComponent,
    ProfileLimit,
    ProfileName,
    ProfileMissing,
    ProfileCode,
    SnapshotMissing,
    SnapshotFailed,
    ChecksumMismatch,
    ReleaseUnavailable,
    InvalidPath,
    Autostart,
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("{0}")]
    Io(#[from] std::io::Error),
    #[error("{0}")]
    Json(#[from] serde_json::Error),
    #[error("{0}")]
    Http(#[from] reqwest::Error),
    #[error("{message}")]
    Coded { code: ErrorCode, message: String },
}

impl AppError {
    pub fn coded(code: ErrorCode, message: impl Into<String>) -> Self {
        Self::Coded { code, message: message.into() }
    }

    pub fn code(&self) -> ErrorCode {
        match self {
            Self::Io(_) => ErrorCode::Io,
            Self::Json(_) => ErrorCode::Json,
            Self::Http(_) => ErrorCode::Http,
            Self::Coded { code, .. } => *code,
        }
    }
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let mut state = serializer.serialize_struct("AppError", 2)?;
        state.serialize_field("code", &self.code())?;
        state.serialize_field("message", &self.to_string())?;
        state.end()
    }
}

pub type AppResult<T> = Result<T, AppError>;
