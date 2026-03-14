const domain = window.location.hostname;

function getColor(domain) {
    let hash = 0;

    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

const color = getColor(domain);

const border = document.createElement("div");

border.style.position = "fixed";
border.style.top = "0";
border.style.left = "0";
border.style.right = "0";
border.style.bottom = "0";
border.style.border = `8px solid ${color}`;
border.style.pointerEvents = "none";
border.style.zIndex = "999999";

document.documentElement.appendChild(border);

console.log("yiyi");