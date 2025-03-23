document.addEventListener("DOMContentLoaded", fetchStoryDetail);

const API_URL = "https://script.google.com/macros/s/AKfycbzv7XC22j3EXNT5kEzjEh_oe8RJZmBXftlZHHu6DuNkly8GH-Wfdv_ZahoUVks5LlVHfA/exec";

// 🔹 URLからタイトルを取得
function getStoryTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("title");
}

// 🔹 小噺の詳細データを取得
function fetchStoryDetail() {
    const title = getStoryTitleFromURL();
    if (!title) {
        console.error("❌ タイトルが指定されていません");
        return;
    }

    console.log(`📢 データ取得開始: ${title}`);
    fetch(`${API_URL}?action=get`)
    .then(response => response.json())
    .then(data => {
        const story = data.find(s => s.title === title);
        if (story) {
            displayStory(story);
        } else {
            console.error("❌ 該当する小噺が見つかりません");
        }
    })
    .catch(error => {
        console.error("❌ データ取得エラー:", error);
    });
}

// 🔹 小噺の詳細を表示（改行も反映）
function displayStory(story) {
    const container = document.getElementById("story-container");
    container.innerHTML = `
        <h2>${story.title}</h2>
        <p>${story.body.replace(/\n/g, "<br>")}</p>
        <p><strong>ジャンル:</strong> ${story.genre}</p>
        <p><strong>いいね:</strong> <span id="likes-${story.title}">${story.likes}</span></p>
        <button onclick="likeStory('${story.title}')">❤️ いいね</button>
        <button class="profile-btn" onclick="showProfile('${story.author}', '${story.profile}')">👤 作者プロフィールを見る</button>
    `;
}


// 🔹 いいねボタンを押したときの処理（スプレッドシートに反映）
function likeStory(title) {
    console.log(`👍 いいねボタンが押されました: ${title}`);

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",  // no-corsモードではレスポンスの内容を取得できない
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    })
    .then(() => {
        // レスポンスが取れないため、成功した前提で通知
        alert(`「${title}」に いいねしました！（反映まで少し時間がかかる場合があります）`);
    })
    .catch(error => {
        console.error("❌ いいね送信エラー:", error);
        alert("いいねに失敗しました。もう一度お試しください。");
    });
}




// 🔹 いいね数を更新
function updateLikeCount(title, newLikes) {
    const likeElement = document.getElementById(`likes-${title}`);
    if (likeElement) {
        likeElement.innerText = newLikes;
    } else {
        console.error(`⚠️ いいね表示要素が見つかりませんでした: ${title}`);
    }
}

// 🔹 プロフィールモーダルを表示
function showProfile(author, profile) {
    const modal = document.getElementById("profile-modal");
    const profileTitle = document.getElementById("profile-title");
    const profileText = document.getElementById("profile-text");

    profileTitle.innerText = `作者: ${author}`;
    profileText.innerText = profile;

    modal.style.display = "block";

    // ✅ モーダルを閉じる処理
    document.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // ✅ モーダル外をクリックして閉じる
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}
