class Exercise < ApplicationRecord

  validates :title, presence: :true
  validates :description, length: { maximum: 500 }
  validates :calories, numericality: { greater_than_or_equal_to:100, less_than_or_equal_to: 500,  only_integer: true }
  validates :sets, numericality: { greater_than_or_equal_to:3, less_than_or_equal_to: 15,  only_integer: true }
  validates :repetitions, numericality: { greater_than_or_equal_to:5, less_than_or_equal_to: 30,  only_integer: true }
  validates :rest, numericality: { greater_than_or_equal_to:10, less_than_or_equal_to: 60,  only_integer: true }

  belongs_to :program

  has_attached_file :video
  validates_attachment :video, presence: true
  do_not_validate_attachment_file_type :video
end
