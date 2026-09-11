(function () {
  const CRITERIA = `You are helping me write a model answer for the current modular Goethe-Zertifikat C1 Schreiben (introduced 01.01.2024). Follow official exam standards, not random textbook tips.

Official facts:
- Writing module: 2 tasks, 75 minutes total, 100 points, pass at 60/100.
- Graded by two independent raters. Only predetermined point values; no intermediate values.
- Only the final clean copy is graded.

Official criteria (both tasks), A–E bands (A fully appropriate … E inadequate):
1. Aufgabenerfüllung — all content points; required language functions; appropriate length; suitable register / sociocultural appropriateness.
2. Kohärenz — visible structure; logical progression; effective linking.
3. Wortschatz — range, precision, control.
4. Strukturen — grammar range and control; morphology; syntax; spelling; punctuation.

Hard rules:
- If Aufgabenerfüllung is E, that entire task scores 0.
- Far below the required length: Aufgabenerfüllung drops sharply.
- A text can sound intelligent and still lose many points if one Inhaltspunkt is missing.
- Frequent grammar/spelling errors matter most when they disturb reading.
- Do not claim this is an official examiner score; write a C1 model answer aligned with the criteria.

Write the Musterlösung in German. Cover every Inhaltspunkt. Keep the register exam-appropriate. Do not add extra tasks. After the model text, optionally add a short checklist of how each Inhaltspunkt was covered.`;

  const TAIL = "Below is the original text of this exam question:";

  window.C1_PROMPTS = {
    teil1:
      CRITERIA +
      `

This request is Schreiben Teil 1 only:
- Diskussionsbeitrag in an online forum
- about 230 words
- suggested time 50 minutes
- 4 required Inhaltspunkte
- typical functions: explain, argue, justify with an example, name disadvantages / alternatives / measures
- register: neutral-to-discursive forum style
- a clear line of argument matters more than packing in unrelated examples

Write one complete Teil-1 Musterlösung.

` +
      TAIL,

    teil2:
      CRITERIA +
      `

This request is Schreiben Teil 2 only:
- (halb-)formelle Nachricht / E-Mail
- about 120 words
- suggested time 25 minutes
- 4 required Inhaltspunkte
- typical functions: open politely, describe a problem or situation, make a request or proposal, show understanding / suggest compromise
- register: polite, semi-formal or formal
- tone control is crucial; a complete email with weak politeness cannot score highly on Aufgabenerfüllung

Write one complete Teil-2 Musterlösung.

` +
      TAIL,
  };
})();
