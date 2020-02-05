class Exercise < ApplicationRecord
  belongs_to :program
  has_attached_file :video
  validates_attachment :video, presence: true
  do_not_validate_attachment_file_type :video
end
