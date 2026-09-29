import type { AuthoredSection } from '@/lib/shared-content';

export const operativeSections = [
  {
    id: 'surgical-anatomy',
    title: 'Surgical anatomy',
    summary:
      'Descriptive anatomy relevant to laparoscopic cholecystectomy; management recommendations use separate sources.',
    blocks: [
      {
        id: 'gallbladder-structure',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The gallbladder lies on the underside of the liver, between segments IVb and V, and has a fundus, body, infundibulum and neck.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'biliary-anatomy',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The cystic duct usually connects the gallbladder to the common bile duct, and the common hepatic duct lies above this junction. Biliary anatomy varies considerably, which matters for surgical safety.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'cystic-artery',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'The cystic artery usually arises from the right hepatic artery, but its origin and course vary.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'hepatocystic-triangle',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Hepatocystic triangle',
        meaning:
          'The space bounded by the cystic duct, the common hepatic duct and the edge of the liver. It usually contains the cystic artery and a lymph node (the Lund node, sometimes miscalled the Calot node).',
        referenceIds: ['lapchole-textbook', 'gallbladder-anatomy-textbook'],
      },
      {
        id: 'triangle-terminology',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          '“Calot’s triangle” is often used for the same space, but Calot’s original 1891 description used the cystic artery, rather than the liver edge, as a boundary, so the two terms are not exact synonyms.',
        ],
        referenceIds: ['gallbladder-anatomy-textbook'],
      },
      {
        id: 'bile-duct-danger',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Bile duct injury is the most common serious complication of laparoscopic cholecystectomy, and the critical view of safety is used to minimise that risk.',
        ],
        referenceIds: ['safe-cholecystectomy', 'lapchole-textbook'],
      },
    ],
  },
  {
    id: 'laparoscopic-cholecystectomy',
    title: 'Laparoscopic cholecystectomy',
    blocks: [
      { include: 'operative-disclaimer' },
      {
        id: 'operation-outline',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Under general anaesthetic, the gallbladder is removed through several small cuts using a laparoscope; open surgery is sometimes needed, for example if the gallbladder is very inflamed or keyhole removal is not possible.',
        ],
        referenceIds: ['nhs-gallbladder-removal'],
      },
      {
        id: 'operative-preparation',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Confirm the agreed procedure and perioperative plan during the safety checklist. Assess VTE and bleeding risk and agree appropriate prophylaxis; give prophylactic antibiotics according to institutional protocol.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-perioperative', 'nice-vte', 'lapchole-textbook'],
      },
      {
        id: 'preoperative-preparation-todo',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Clinical-review TODO: pre-anaesthetic assessment, fasting instructions and pre-operative investigations are not yet sourced from UK clinical guidance for this topic; NHS patient information describes a pre-admission clinic and fasting instructions only.',
        referenceIds: [],
      },
      // Rationale blocks quoted in full by the operative walkthrough.
      {
        id: 'positioning-rationale',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Tilting the patient head-up with a slight left tilt elevates the gallbladder and lets adjacent organs fall away, improving visualisation and reducing the risk of injury. Wide preparation and draping allow conversion to open surgery if needed.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'exposure-rationale',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Retracting the gallbladder fundus upwards and laterally towards the right shoulder exposes the hepatocystic triangle.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'cvs-purpose',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'A multi-society guideline suggests using the critical view of safety to identify the cystic duct and cystic artery before they are clipped and divided. The recommendation rests on expert opinion, not direct comparative evidence; the critical view helps minimise, but does not remove, the risk of bile duct injury.',
        ],
        referenceIds: ['safe-cholecystectomy', 'lapchole-textbook'],
      },
      {
        id: 'bleeding-check-rationale',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Reducing the insufflation pressure before finishing can reveal venous bleeding that the higher pressure had tamponaded.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'closure-rationale',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Fascial closure of larger port sites is described to reduce the risk of port-site hernia; practice varies.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'operative-sequence',
        type: 'checklist',
        minimumLevel: 'medical-student',
        title: 'Understand the operative sequence',
        items: [
          'Position supine, then tilt head-up and slightly to the left; establish the pneumoperitoneum and place the ports under direct vision.',
          'Retract the gallbladder fundus towards the right shoulder to expose the hepatocystic triangle.',
          'Dissect the hepatocystic triangle to achieve the critical view of safety before clipping or dividing any structure.',
          'Clip and divide the cystic duct and cystic artery once they are confirmed.',
          'Dissect the gallbladder from the liver bed, from the infundibulum towards the fundus.',
          'Check haemostasis, retrieve the gallbladder in a pouch, inspect the port sites and close.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'cvs-criteria',
        type: 'checklist',
        minimumLevel: 'cst',
        title: 'Critical view of safety',
        items: [
          'Clear all fibrofatty tissue from the hepatocystic triangle.',
          'Identify two, and only two, tubular structures entering the gallbladder: the cystic duct and the cystic artery.',
          'Expose the cystic plate by separating the lower third of the gallbladder from the liver bed.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'cvs-rationale',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'The evidence for the critical view is indirect: analysed bile duct injuries usually occurred when it had not been attained, and it is achievable in most cases when attempted routinely. When it cannot reasonably be achieved, another way of defining the anatomy or of concluding the operation is needed.',
        ],
        referenceIds: ['safe-cholecystectomy'],
      },
      {
        id: 'technique-variation',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Port positions, energy devices and closure vary between surgeons. Fluorescence cholangiography with indocyanine green can help delineate biliary anatomy.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'senior-help',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'With unclear anatomy or complexity beyond your competence, involve an appropriately experienced colleague.',
        ],
        referenceIds: ['rcs-gsp'],
      },
      // Plan-changing findings, quoted in full by "What changes the plan".
      {
        id: 'difficult-gallbladder',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'A difficult gallbladder can relate to obesity, adhesions, acute or chronic inflammation, a distended gallbladder or liver cirrhosis.',
        ],
        referenceIds: ['wses-cholecystitis'],
      },
      {
        id: 'unclear-anatomy',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'The multi-society guideline strongly recommends intraoperative biliary imaging, particularly cholangiography, when the anatomy is uncertain or a bile duct injury is suspected, although the certainty of evidence is very low.',
        ],
        referenceIds: ['safe-cholecystectomy'],
      },
      {
        id: 'conversion',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'WSES recommends conversion to open surgery for severe local inflammation, adhesions, bleeding in the hepatocystic triangle or suspected bile duct injury. Conversion is a judicious clinical decision, not a complication or a failure.',
        ],
        referenceIds: ['wses-cholecystitis', 'lapchole-textbook'],
      },
      {
        id: 'subtotal-cholecystectomy',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'When the critical view of safety cannot be achieved and the anatomy cannot be clearly defined by other methods, such as imaging, the multi-society guideline suggests considering subtotal cholecystectomy rather than total cholecystectomy by a fundus-first approach (expert opinion). This avoids dissection in the hepatocystic triangle; WSES also recommends subtotal cholecystectomy when anatomical identification is difficult and the risk of injury is high.',
        ],
        referenceIds: ['safe-cholecystectomy', 'wses-cholecystitis'],
      },
      {
        id: 'bile-duct-injury-referral',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'Confirmed or suspected bile duct injury should be referred to an experienced surgeon or a multispecialty hepatobiliary team.',
        ],
        referenceIds: ['safe-cholecystectomy'],
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
          'Many people go home on the same day; some need to stay overnight.',
          'Wound pain usually settles over a few days. Shoulder-tip pain from retained carbon dioxide can occur and settles as the gas is absorbed.',
          'Temporary intolerance of fatty foods, with bloating or diarrhoea, can occur and usually improves.',
        ],
        referenceIds: ['nhs-gallbladder-removal', 'cholecystitis-textbook'],
      },
      {
        id: 'postoperative-review',
        type: 'checklist',
        minimumLevel: 'foundation',
        title: 'Ward review',
        items: [
          'Review observations, pain, the wounds and the operative findings; escalate deterioration promptly.',
          'Reassess VTE and bleeding risk and encourage mobilisation.',
          'Do not continue antibiotics routinely after surgery for uncomplicated cholecystitis when the source is controlled; for complicated disease follow the operative findings and local policy.',
        ],
        localPolicyMayVary: true,
        referenceIds: [
          'rcs-gsp',
          'nice-sepsis',
          'nice-vte',
          'wses-cholecystitis',
        ],
      },
      {
        id: 'postoperative-warning',
        type: 'warning',
        minimumLevel: 'medical-student',
        title: 'Symptoms that need prompt review',
        text: 'Severe or worsening pain, yellowing of the skin or eyes, a high temperature or shivering, wound redness, swelling or pus, or leg swelling need prompt assessment; leg swelling with breathlessness or chest pain needs emergency care.',
        referenceIds: ['nhs-gallbladder-removal'],
      },
      {
        id: 'diet-advice',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'After gallbladder removal people should not need to avoid foods that previously triggered symptoms, but should seek advice if eating triggers symptoms after they have recovered.',
        ],
        referenceIds: ['nice-gallstones'],
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
          'Complications described in NHS patient information — not a treatment protocol',
        columns: ['Complication', 'Patient-information context'],
        rows: [
          [
            'Bile duct or organ injury',
            'Uncommon; further surgery may be needed.',
          ],
          [
            'Bile leak',
            'Rare; another operation may be needed to drain the bile.',
          ],
          [
            'Retained stones',
            'Stones left in the bile ducts can cause pain and jaundice and may need further treatment.',
          ],
          ['Wound infection', 'Usually treated with antibiotics.'],
          [
            'Blood clots',
            'Compression stockings or anticoagulant medicines may be suggested to reduce the risk.',
          ],
        ],
        referenceIds: ['nhs-gallbladder-removal'],
      },
      {
        id: 'bile-leak',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'A postoperative bile leak can present with vague pain, fever and raised bilirubin. Ultrasound or CT, and in unclear cases a HIDA scan, are used to assess it, and ERCP with sphincterotomy and stenting may be needed.',
        ],
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'post-cholecystectomy-symptoms',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Nausea, vomiting, indigestion, abdominal pain or diarrhoea after surgery (sometimes called post-cholecystectomy syndrome) usually settle; persistent symptoms need review.',
        ],
        referenceIds: ['nhs-gallbladder-removal'],
      },
      {
        id: 'complication-management-todo',
        type: 'sourceNote',
        minimumLevel: 'cst',
        text: 'Clinical-review TODO: assessment and management pathways for bile duct injury, bleeding and retained stones need specialist review. The patient-information table is not a management algorithm.',
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
          'Explain why cholecystectomy is proposed and what the operation involves.',
          'Discuss reasonable alternatives and what no treatment could mean; in acute cholecystitis, drainage of the gallbladder may be offered when surgery is not an option.',
          'Explore what matters to this patient and discuss material risks in that context.',
          'Allow questions, check understanding and document the discussion; a signed form does not replace this conversation.',
        ],
        referenceIds: ['rcs-consent', 'nhs-cholecystitis'],
      },
      {
        id: 'procedure-risks',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Discuss bleeding, infection, injury to the bile ducts or other organs, bile leak, retained stones and blood clots in relation to this patient, and explain that open surgery is sometimes needed.',
        ],
        referenceIds: ['nhs-gallbladder-removal', 'rcs-consent'],
      },
      {
        id: 'patient-understanding',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Gallbladder removal is usually recommended when gallstones cause problems; stones that cause no symptoms may not need treatment.',
          'In acute cholecystitis, if surgery is not an option, a procedure to drain the gallbladder may be offered.',
          'It is usually keyhole surgery under general anaesthetic through a few small cuts; open surgery is sometimes needed, for example if the gallbladder is very inflamed.',
          'There is usually a pre-admission check beforehand, and fasting instructions need to be followed.',
          'Many people go home the same day; return to work depends on the job and the type of surgery.',
          'Risks include blood clots, wound infection, bile leak, stones left in the bile ducts and injury to the bile ducts or other organs; individual risk depends on age and general health.',
          'People can lead a normal life without a gallbladder.',
        ],
        referenceIds: [
          'nhs-gallbladder-removal',
          'nhs-gallstones',
          'nhs-cholecystitis',
        ],
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
