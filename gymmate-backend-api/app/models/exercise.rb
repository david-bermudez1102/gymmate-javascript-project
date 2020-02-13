class Exercise < ApplicationRecord

  validates :title, presence: :true
  validates :description, length: { maximum: 140 }
  validates :calories, length: { minimum: 100, maximum: 500 }
  validates :sets, length: { minimum: 3, maximum: 15 }
  validates :repetitions, length: { minimum: 5, maximum: 30 }
  validates :rest, length: { minimum: 10, maximum: 60 }

  belongs_to :program

  has_attached_file :video
  validates_attachment :video, presence: true
  do_not_validate_attachment_file_type :video
end
