document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".org-chart-section",
            start: "top center",
            toggleActions: "play none none reverse", // Play on enter, reverse on leave
        }
    });

    // 1. Make the whole chart visible
    tl.to(".org-chart", { autoAlpha: 1, duration: 0.1 });

    // 2. Animate Director Node
    tl.from(".director", { scale: 0, autoAlpha: 0, ease: "back.out(1.7)", duration: 0.5 });

    // 3. Animate the line down from Director
    tl.from('div[data-anim="line-down"]', { scaleY: 0, transformOrigin: "top", duration: 0.3 });
    
    // 4. Animate the horizontal line
    tl.from('div[data-anim="line-across"]', { scaleX: 0, transformOrigin: "center", duration: 0.5 });

    // 5. Animate lines down to groups and the group heads themselves
    tl.from('div[data-anim="line-to-group"]', { scaleY: 0, transformOrigin: "top", stagger: 0.15, duration: 0.3 });
    tl.from('div[data-anim="node"]', { y: -20, autoAlpha: 0, stagger: 0.15, duration: 0.4 }, "-=0.3");
    
    // 6. Animate lines to sub-nodes and the sub-nodes themselves
    tl.from('div[data-anim="line-to-sub"]', { scaleY: 0, transformOrigin: "top", stagger: 0.15, duration: 0.3 });
    tl.from('div[data-anim="sub-node"]', { y: -10, autoAlpha: 0, stagger: 0.05, duration: 0.3 }, "-=0.2");

}); 