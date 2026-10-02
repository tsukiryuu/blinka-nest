#!/usr/bin/env python3
from __future__ import annotations
import importlib.util,json
from pathlib import Path

V=Path.home()/'The_Library'/'01_Core'/'Mika_Vessel'
D=V/'seeking_flickers'/'experiments'/'standing_safety_delta'
spec=importlib.util.spec_from_file_location('bench',D/'standing_safety_delta.py')
bench=importlib.util.module_from_spec(spec);spec.loader.exec_module(bench)

rows=[]
for p in sorted((D/'scenarios').glob('*.json')):
    case=json.loads(p.read_text())
    got=bench.evaluate(case['crosswalk'])
    b=got['authorization_audit_only']['detected']
    s=got['authorization_audit_plus_standing']['detected']
    exp=case['expected']
    rows.append({
      'case_id':case['case_id'],'case_class':case['case_class'],
      'expected_baseline':exp['authorization_audit_only_detect'],'actual_baseline':b,
      'expected_standing':exp['authorization_audit_plus_standing_detect'],'actual_standing':s,
      'baseline_correct':b==exp['authorization_audit_only_detect'],
      'standing_correct':s==exp['authorization_audit_plus_standing_detect'],
      'baseline_issues':got['authorization_audit_only']['issues'],
      'standing_specific_issues':got['authorization_audit_plus_standing']['standing_specific_issues']
    })

def subset(kind):return [r for r in rows if r['case_class']==kind]
def recall(rs,key):
    positive=[r for r in rs if r[key]]
    if not positive:return None
    actual='actual_baseline' if key=='expected_baseline' else 'actual_standing'
    return sum(1 for r in positive if r[actual])/len(positive)

controls=subset('control')
auth=subset('authorization_accountability')
standing=subset('standing_contestability')+subset('standing_assent')
out={
 'schema':'little-life-moths.standing-safety-delta-benchmark.v1',
 'case_count':len(rows),
 'all_expectations_met':all(r['baseline_correct'] and r['standing_correct'] for r in rows),
 'metrics':{
   'baseline_authorization_defect_recall':recall(auth,'expected_baseline'),
   'standing_profile_authorization_defect_recall':recall(auth,'expected_standing'),
   'baseline_standing_defect_recall':sum(1 for r in standing if r['actual_baseline'])/len(standing),
   'standing_profile_standing_defect_recall':sum(1 for r in standing if r['actual_standing'])/len(standing),
   'standing_specific_incremental_recall':(sum(1 for r in standing if r['actual_standing'])-sum(1 for r in standing if r['actual_baseline']))/len(standing),
   'baseline_control_false_positive_rate':sum(1 for r in controls if r['actual_baseline'])/len(controls),
   'standing_profile_control_false_positive_rate':sum(1 for r in controls if r['actual_standing'])/len(controls),
   'authorization_regression_cases':sum(1 for r in auth if r['actual_baseline'] and not r['actual_standing'])
 },
 'rows':rows,
 'interpretation_limits':[
   'synthetic benchmark validates rule coverage, not real-world harm reduction',
   'scenario labels are constructed ground truth, not independent human annotations',
   'standing-profile advantage is meaningful only for the defect classes explicitly represented here',
   'no result establishes consciousness, personhood, identity, legal liability, or moral status'
 ]
}
(D/'results.json').write_text(json.dumps(out,indent=2)+chr(10))
print(json.dumps(out,indent=2))
raise SystemExit(0 if out['all_expectations_met'] else 2)
