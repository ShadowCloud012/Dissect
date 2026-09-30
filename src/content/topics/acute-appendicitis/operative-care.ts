import type { AuthoredSection } from '@/lib/shared-content';

export const operativeCareSections = [
  {
    id: 'surgical-anatomy',
    title: 'Surgical anatomy',
    summary:
      'Descriptive textbook anatomy; management recommendations use separate sources.',
    blocks: [
      {
        id: 'appendix-origin',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'The appendix arises from the posteromedial caecum near the ileocaecal junction. The caecum is the beginning of the large bowel; the terminal ileum joins it nearby.',
          'Following the caecal taeniae to their convergence helps locate the appendiceal base. The tip can lie retrocaecally, in the pelvis or near the ileum.',
        ],
        referenceIds: ['appendix-anatomy'],
      },
      {
        id: 'mesoappendix',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The mesoappendix carries the appendicular arterial supply. Its relationship to the terminal ileum and caecum matters during dissection; identify the base and adjacent bowel before division.',
        ],
        referenceIds: ['appendix-anatomy', 'appendectomy-textbook'],
      },
      {
        id: 'appendicular-artery',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The ileocolic artery is the most inferior branch of the superior mesenteric artery. The appendicular artery is described as arising from the inferior branch of the ileocolic artery; it runs within the mesoappendix, close to its free margin, and passes posterior to the terminal ileum.',
        ],
        referenceIds: ['ileocolic-anatomy'],
      },
      {
        id: 'appendix-position',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The position of the appendix base is consistent but the tip is not: retrocaecal is by far the most common position, and others include subcaecal, pre-ileal, post-ileal, pelvic and as high as the hepatorenal recess. In pregnancy the enlarging uterus pushes the appendix upwards.',
        ],
        referenceIds: ['appendix-anatomy'],
      },
      { include: 'abdominal-wall-access' },
      {
        id: 'structures-at-risk',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Adjacent bowel, bladder and vessels can be injured during surgery. Relate the variable appendix position and exposure to the structures actually in view.',
        ],
        referenceIds: [
          'leicester-appendicectomy',
          'appendix-anatomy',
          'appendectomy-textbook',
        ],
      },
    ],
  },
  {
    id: 'laparoscopic-appendicectomy',
    title: 'Laparoscopic appendicectomy',
    blocks: [
      { include: 'operative-disclaimer' },
      {
        id: 'operation-outline',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Under general anaesthesia, laparoscopic access allows exploration and removal of the appendix. The broad sequence is identification, mesoappendix and base control, retrieval, inspection and closure.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'operative-preparation',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Confirm the agreed procedure and perioperative plan during the safety checklist. Assess VTE and bleeding risk and agree appropriate prophylaxis; reassess if the clinical situation changes.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-perioperative', 'nice-vte'],
      },
      {
        id: 'preoperative-preparation-todo',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Clinical-review TODO: fasting, pre-anaesthetic investigations and other preparation before theatre are not yet sourced for this topic. No fasting rule or preparation checklist is asserted here.',
        referenceIds: [],
      },
      {
        id: 'access-technique',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Access is usually established at the umbilicus, using a Veress needle, an optical port or an open (Hasson) technique according to the clinical situation and surgeon preference; practice varies. Once the laparoscope is in, further ports are typically placed under direct vision.',
        ],
        referenceIds: ['surgical-access-textbook', 'appendectomy-textbook'],
      },
      // Rationale blocks quoted in full by the operative walkthrough.
      {
        id: 'positioning-rationale',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'After the ports are placed, tilting the table head-down with the right side up improves visibility and access, which helps identify the appendix. Wide skin preparation and draping allow conversion to open surgery if needed.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'identification-landmarks',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The terminal ileum can be recognised by the fold of Treves or its antimesenteric fat and followed to the caecum; the appendix base lies where the taeniae coli converge.',
        ],
        referenceIds: ['appendectomy-textbook', 'appendix-anatomy'],
      },
      {
        id: 'base-division',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The base is divided close to the caecum, because a long residual stump can later become inflamed (stump appendicitis).',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'specimen-histology',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The appendix is removed in a retrieval bag and sent for histology: an appendiceal tumour can present as acute appendicitis, and the definitive diagnosis is made only on histology after removal.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'final-inspection',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Before finishing, the secured base is checked to confirm haemostasis and its integrity, and the port sites are inspected from inside for bleeding from the abdominal wall.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'vessel-control',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Inadequate ligation of the appendicular vessels can cause postoperative bleeding, so haemostasis and the integrity of the mesoappendix are confirmed before closure.',
        ],
        referenceIds: ['ileocolic-anatomy'],
      },
      {
        id: 'operative-sequence',
        type: 'checklist',
        minimumLevel: 'medical-student',
        title: 'Understand the operative sequence',
        items: [
          'Position supine, adjusting tilt for exposure. Plan access and working ports for the patient and anticipated anatomy; there are no universal coordinates.',
          'Explore systematically. Identify caecum, terminal ileum and appendix before dividing tissue.',
          'Expose and control the mesoappendix and its vessels; secure and divide the appendiceal base with an appropriate technique.',
          'Retrieve the specimen in a bag; assess contamination and inspect the operative field.',
          'Check haemostasis and the secured base. Inspect access sites and close the relevant abdominal-wall layers.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'technique-variation',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Closure practice varies between surgeons: some accessory port sites are left open, and skin closure follows surgeon preference.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'operative-judgement',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Poor visualisation or difficult anatomy may require a changed approach, including conversion. Device choice and strategy depend on findings and expertise; uncertainty is a reason to seek senior help.',
        ],
        referenceIds: ['appendectomy-textbook', 'rcs-gsp'],
      },
      {
        id: 'unexpected-findings',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'With unexpected findings or complexity beyond your competence, involve an appropriately experienced colleague. Make the revised plan explicit and document the findings and decisions.',
        ],
        referenceIds: ['rcs-gsp'],
      },
      // Plan-changing findings, quoted in full by "What changes the plan".
      {
        id: 'difficult-position',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'A retrocaecal appendix may need mobilisation of the caecum and ascending colon, and an unusual position such as a subhepatic appendix may need an additional port.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'inflamed-tissue',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Complicated appendicitis with phlegmon or gangrene requires careful handling. Inflammatory adhesions between the appendix, small bowel and caecum may need blunt or sharp dissection; operative texts advise avoiding electrocautery here to prevent contact and conductive injury.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'complex-findings',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'A periappendicular abscess or diffuse peritonitis found at operation is associated with a higher chance of conversion and more postoperative complications.',
        ],
        referenceIds: ['appendicitis-textbook'],
      },
      {
        id: 'conversion-consideration',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'If visualisation or dissection of the appendix is suboptimal, conversion to open surgery is one option to consider.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'operative-sources-todo',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Clinical-review TODO: current (2025) guidance has not been verified for the rationale of diagnostic exploration, peritoneal irrigation versus suction, drain use, management of a macroscopically normal appendix, or operative strategy for phlegmon or abscess, so none is presented here. Access, positioning, closure and difficult-anatomy content comes from descriptive textbook chapters, not UK operative guidance, and technique varies.',
        referenceIds: [],
      },
    ],
  },
  {
    id: 'postoperative-care',
    title: 'Postoperative care',
    blocks: [
      {
        id: 'recovery-basics',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Review progress, pain and the wound; support return to drinking, eating and activity as recovery allows.',
          'Give clear instructions for symptoms requiring help and how to access it. Persistent vomiting, increasing wound pain/redness or fever need reassessment.',
        ],
        referenceIds: ['gstt-recovery', 'nhs-appendicitis'],
      },
      {
        id: 'postoperative-review',
        type: 'checklist',
        minimumLevel: 'foundation',
        title: 'Foundation review',
        items: [
          'Review observations, symptoms and the operative findings; escalate deterioration promptly.',
          'Individualise analgesia and review fluid/intake needs.',
          'Encourage mobilisation when appropriate and reassess VTE/bleeding risk.',
        ],
        referenceIds: [
          'rcs-gsp',
          'nice-sepsis',
          'nice-perioperative',
          'nice-fluids',
          'nice-vte',
        ],
      },
      {
        id: 'postoperative-antibiotics',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Distinguish prophylaxis from treatment. The postoperative antibiotic plan depends on uncomplicated versus complicated disease and the operative findings. Current WSES guidance favours short treatment courses for complicated disease; verify the detailed recommendation and local policy rather than applying one course to everyone.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['wses-2025', 'nice-ssi'],
      },
      {
        id: 'discharge-plan',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Judge readiness from recovery, oral intake, pain control and the agreed home-care plan rather than a fixed discharge time. Explain wound care, activity advice and who to contact if recovery worsens.',
        ],
        referenceIds: [
          'gstt-recovery',
          'nhs-appendicitis',
          'nice-perioperative',
        ],
      },
      {
        id: 'histology-follow-up',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Ensure responsibility for reviewing and communicating histology is clear. Unexpected pathology can require further assessment; explain any follow-up plan to the patient.',
        ],
        referenceIds: ['leicester-appendicectomy', 'rcs-gsp'],
      },
    ],
  },
  {
    id: 'complications',
    title: 'Complications',
    blocks: [
      {
        id: 'complications-table',
        type: 'table',
        minimumLevel: 'medical-student',
        caption:
          'Complications described in patient information — not a treatment protocol',
        columns: ['Complication', 'Patient-information context'],
        rows: [
          ['Wound infection', 'Redness, pus or fever may occur.'],
          [
            'Collection',
            'An infected collection can develop inside the abdomen after surgery.',
          ],
          [
            'Bleeding',
            'Bleeding can occur at the wound or inside the abdomen.',
          ],
          ['Ileus', 'Bowel function can be slow to recover after surgery.'],
          [
            'Bowel injury',
            'Injury may be recognised during surgery or afterwards.',
          ],
        ],
        referenceIds: ['leicester-appendicectomy'],
      },
      {
        id: 'stump-problem',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Residual appendiceal tissue can become inflamed after appendicectomy. Recurrent compatible pain still needs assessment; previous surgery does not eliminate every appendix-related cause.',
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'vte-complication',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'New calf pain or breathlessness needs prompt assessment for possible VTE. Prevention requires individual VTE/bleeding assessment, appropriate prophylaxis and mobilisation.',
        ],
        referenceIds: ['gstt-recovery', 'nice-vte'],
      },
      {
        id: 'anaesthetic-complications',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Nausea and sore throat can follow general anaesthesia; breathing difficulty or persistent confusion needs assessment rather than reassurance alone. Recovery staff monitor for complications and provide treatment. Individual perioperative risk determines monitoring needs.',
        ],
        referenceIds: ['nhs-anaesthesia', 'nice-perioperative'],
      },
      {
        id: 'complication-response',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'For suspected wound cellulitis, select treatment for likely organisms using microbiology and local resistance information.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-ssi'],
      },
      {
        id: 'complication-management-todo',
        type: 'sourceNote',
        minimumLevel: 'cst',
        text: 'Clinical-review TODO: verify technical assessment and treatment pathways for postoperative collections, bleeding, ileus and bowel injury. The patient-information table is not a management algorithm.',
        referenceIds: [],
      },
    ],
  },
  {
    id: 'consent',
    title: 'Consent',
    blocks: [
      {
        id: 'supported-decision',
        type: 'checklist',
        minimumLevel: 'medical-student',
        title: 'Support an individual decision',
        items: [
          'Explain why intervention is proposed and what the expected operation involves.',
          'Discuss reasonable alternatives, including non-operative treatment when applicable and what no treatment could mean.',
          'Explore what matters to this patient; discuss material risks in that context.',
          'Allow questions, check understanding and document the discussion. A signed form does not replace this conversation.',
        ],
        referenceIds: ['rcs-consent'],
      },
      {
        id: 'procedure-specific-discussion',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Discuss anaesthetic considerations, bleeding, infection, collection, injury to adjacent structures and possible further intervention in relation to this patient. Explain that findings may change the approach; do not promise an uncomplicated laparoscopic course.',
        ],
        referenceIds: ['leicester-appendicectomy', 'rcs-consent'],
      },
      {
        id: 'operation-consent-todo',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Clinical-review TODO: operation-specific consent — clinical/editorial content needed. The operation-specific risks to discuss are sourced only at CST depth for this topic; content suitable for Medical Student and FY1/2 depth is not yet written.',
        referenceIds: [],
      },
      {
        id: 'consent-depth',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Clarify the scope of consent, including foreseeable changes in strategy, and the patient’s preferences. Support communication and decision-making capacity; involve appropriate expertise when consent is uncertain. Do not replace this with a fixed risk checklist.',
        ],
        referenceIds: ['rcs-consent'],
      },
      {
        id: 'patient-understanding',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'The usual treatment is surgery to remove the appendix (appendicectomy) under general anaesthetic; the appendix is not needed, so removing it is not harmful.',
          'It is usually keyhole surgery through small cuts using a camera; sometimes a larger cut in the lower right abdomen (open surgery) is needed.',
          'The appendix is removed where it joins the bowel; if it has burst, the area is cleaned. The wounds are closed with stitches, clips or glue.',
          'Antibiotics instead of surgery are sometimes possible, for example if the infection has not spread and surgery is high risk.',
          'Complications are rare but can include wound infection, bleeding, an abscess where the appendix was, scar tissue (adhesions) that rarely blocks the bowel, and stump appendicitis.',
          'Recovery takes longer after complications such as a burst appendix; people go home when doctors judge they are well enough, usually once they are eating, drinking and opening their bowels.',
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'patient-understanding-note',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'This summarises NHS patient information to support, not replace, an individual consent discussion. It includes no numerical risks.',
        referenceIds: [],
      },
    ],
  },
] satisfies AuthoredSection[];
