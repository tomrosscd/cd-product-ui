"""Materialise independent synthetic fixtures. Never target a consumer checkout."""
from pathlib import Path
import sys
source = Path(__file__).resolve().parent
destination = Path(sys.argv[1]).resolve()
if destination.exists():
    raise SystemExit("Choose a new, empty audit directory outside all consumer checkouts.")
for template in source.rglob("*.template"):
    relative = template.relative_to(source)
    target = destination / relative.with_name(relative.name.removesuffix(".template"))
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(template.read_bytes())
(destination / "audit-results").mkdir()
(destination / "vendor").mkdir()
print(destination)
