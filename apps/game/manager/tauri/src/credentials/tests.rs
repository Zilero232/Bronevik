use serde_json::json;

use super::*;

fn credentials(account_id: u64, bound_at: f64) -> Credentials {
    Credentials { device_id: format!("dev_{account_id}"), secret: "s".repeat(MIN_SECRET_LENGTH), account_id, bound_at: Some(bound_at) }
}

#[test]
fn reads_the_valid_bindings_newest_first() {
    let value = json!({
        "accounts": {
            "1": credentials(1, 100.0),
            "2": credentials(2, 200.0),
            "3": { "device_id": "dev_3", "secret": "short", "account_id": 3 },
            "4": { "device_id": "", "secret": "s".repeat(40), "account_id": 4 },
            "5": "broken"
        }
    });
    let accounts = parse(&value);

    assert_eq!(accounts.iter().map(|item| item.account_id).collect::<Vec<_>>(), vec![2, 1]);
    assert!(parse(&json!({ "accounts": [] })).is_empty());
    assert!(parse(&json!(null)).is_empty());
}

#[test]
fn adds_a_binding_and_keeps_the_rest_of_the_file() {
    let value = json!({ "accounts": { "1": credentials(1, 100.0) }, "extra": true });
    let updated = with_account(Some(value), &credentials(7, 300.0)).unwrap();

    assert_eq!(updated["extra"], json!(true));
    assert_eq!(parse(&updated).iter().map(|item| item.account_id).collect::<Vec<_>>(), vec![7, 1]);
    assert_eq!(parse(&with_account(Some(json!([1, 2])), &credentials(9, 1.0)).unwrap())[0].account_id, 9);
    assert_eq!(parse(&with_account(Some(json!({ "accounts": "x" })), &credentials(9, 1.0)).unwrap())[0].account_id, 9);
}

#[test]
fn saves_both_durable_copies_and_finds_an_account() {
    let root = tempfile::tempdir().unwrap();
    let store = CredentialStore::new(root.path().join("Игра").join("mods").join("configs").join("otmetki"), root.path().join("Роуминг"));

    assert!(store.find(None).is_none());

    store.save(&credentials(1, 100.0)).unwrap();
    store.save(&credentials(2, 50.0)).unwrap();

    assert!(root.path().join("Роуминг").join(FILE_NAME).is_file());
    assert_eq!(store.find(None).unwrap().account_id, 1);
    assert_eq!(store.find(Some(2)).unwrap().account_id, 2);
    assert_eq!(store.find(Some(99)).unwrap().account_id, 1);
    assert_eq!(credentials(5, 1.0).binding().device_id, "dev_5");
}
